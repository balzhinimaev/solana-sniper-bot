# Создать корневые файлы
@(".env.example", "docker-compose.yml", "Dockerfile", "package.json", "tsconfig.json") | ForEach-Object {
    New-Item $_ -ItemType File
}

# Создать папки
@("src", "tests", "docs") | ForEach-Object { New-Item $_ -ItemType Directory }

# Создать структуру src/
@(
    "src/bot",
    "src/twitter",
    "src/solana",
    "src/exchanges",
    "src/models",
    "src/services",
    "src/utils",
    "src/types",
    "src/bot/commands",
    "src/bot/menus",
    "src/bot/middlewares",
    "src/solana/utils",
    "tests/unit",
    "tests/integration"
) | ForEach-Object { New-Item $_ -ItemType Directory }

# Создать файлы в src/
@(
    "src/app.ts",
    "src/config.ts",
    "src/bot/index.ts",
    "src/bot/commands/start.ts",
    "src/bot/commands/wallet.ts",
    "src/bot/commands/accounts.ts",
    "src/bot/menus/mainMenu.ts",
    "src/bot/menus/slippageMenu.ts",
    "src/bot/menus/exchangesMenu.ts",
    "src/bot/middlewares/auth.ts",
    "src/bot/middlewares/encryption.ts",
    "src/twitter/twitterClient.ts",
    "src/twitter/streamManager.ts",
    "src/twitter/parser.ts",
    "src/solana/walletManager.ts",
    "src/solana/transaction.ts",
    "src/solana/utils/rpc.ts",
    "src/solana/utils/priorityFee.ts",
    "src/exchanges/pump.fun.ts",
    "src/exchanges/jupiter.ts",
    "src/exchanges/radium.ts",
    "src/exchanges/baseExchange.ts",
    "src/models/User.ts",
    "src/models/Wallet.ts",
    "src/models/TwitterAccount.ts",
    "src/services/sniperService.ts",
    "src/services/alertService.ts",
    "src/utils/logger.ts",
    "src/utils/encryption.ts",
    "src/utils/helpers.ts",
    "src/types/exchanges.ts",
    "src/types/bot.ts",
    "tests/unit/twitterParser.test.ts",
    "tests/unit/solana.test.ts",
    "tests/integration/botCommands.test.ts",
    "docs/INSTALL.md",
    "docs/USER_GUIDE.md"
) | ForEach-Object { New-Item $_ -ItemType File }