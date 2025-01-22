import ContractParser from '../../src/twitter/parser';
import { SolanaRPC } from '../../src/solana/utils/rpc';

// Мокаем весь модуль SolanaRPC
jest.mock('../../src/solana/utils/rpc', () => ({
    SolanaRPC: jest.fn().mockImplementation(() => ({
        validateAddress: jest.fn(),
    })),
}));

describe('ContractParser', () => {
    let mockRPC: jest.Mocked<SolanaRPC>;
    let parser: ContractParser;

    beforeAll(() => {
        // Типизированный мок
        mockRPC = new SolanaRPC() as jest.Mocked<SolanaRPC>;
        parser = new ContractParser(mockRPC);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Pump.fun URLs', () => {
        it('should extract valid Pump.fun contract', async () => {
            const text = 'New gem! https://pump.fun/coin/5XrYeeNQ4NUGdAZkSdeTK9LMu1AYC7AVEuMg33wRpump';
            const result = await parser.extractContract(text);
            expect(result).toBe('5XrYeeNQ4NUGdAZkSdeTK9LMu1AYC7AVEuMg33wRpump');
        });

        it('should return null for invalid Pump.fun URL', async () => {
            const text = 'Check this pump.fun/coin/';
            const result = await parser.extractContract(text);
            expect(result).toBeNull();
        });
    });

    describe('Jupiter URLs', () => {
        it('should extract valid Jupiter contract', async () => {
            const text = 'Swap here: https://jup.ag/swap/SOL-EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
            const result = await parser.extractContract(text);
            expect(result).toBe('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
        });
    });

    describe('Base58 addresses', () => {
        it('should validate correct Base58 address', async () => {
            const validAddress = '5XrYeeNQ4NUGdAZkSdeTK9LMu1AYC7AVEuMg33wRpump';
            mockRPC.validateAddress.mockResolvedValue(true);

            const text = `Random text with address ${validAddress}`;
            const result = await parser.extractContract(text);

            expect(result).toBe(validAddress);
            expect(mockRPC.validateAddress).toHaveBeenCalledWith(validAddress);
        });

        // Исправленный тест для невалидного Base58-адреса
        it('should reject invalid Base58 address', async () => {
            // Используем строку правильной длины и с допустимыми символами,
            // но которая не является валидным Solana-адресом
            const invalidAddress = '1111111111111111111111111111111111111111111';
            mockRPC.validateAddress.mockResolvedValue(false);

            const text = `Fake address: ${invalidAddress}`;
            const result = await parser.extractContract(text);

            expect(result).toBeNull();
            expect(mockRPC.validateAddress).toHaveBeenCalledWith(invalidAddress);
        });
    });

    describe('Edge cases', () => {
        it('should return null for text without contracts', async () => {
            const text = 'Just random tweet without any links';
            const result = await parser.extractContract(text);
            expect(result).toBeNull();
        });

        it('should handle multiple contracts in one text', async () => {
            const text = `
        First: https://pump.fun/coin/Addr1
        Second: https://jup.ag/swap/SOL-Addr2
        Third: Addr3
      `;
            mockRPC.validateAddress.mockImplementation(async (addr) => addr === 'Addr3');

            const result = await parser.extractContract(text);
            expect(result).toBe('Addr1'); // Проверяем приоритет Pump.fun
        });
    });
});