import { Context, Scenes } from "telegraf";

interface MyWizardSession extends Scenes.WizardSessionData {
    cursor: number;
    page?: number;
    walletData?: {
        isConnecting?: boolean;
        isUpdating?: boolean;
    };
    settingsData?: {
        isEditingAmount?: boolean;
        isEditingSlippage?: boolean;
        purchaseAmount?: number;
        slippage?: number;
    };
}

export interface MyContext extends Context {
    scene: Scenes.SceneContextScene<MyContext, MyWizardSession>;
    wizard: Scenes.WizardContextWizard<MyContext>;
    session: MyWizardSession & Scenes.WizardSession<MyWizardSession>;
}