import { TwitterApi } from 'twitter-api-v2';

class TwitterClient {
    private readonly client: TwitterApi;

    constructor(apiKey: string, apiSecret: string) {
        this.client = new TwitterApi({
            appKey: apiKey,
            appSecret: apiSecret,
        });
    }

    async getStreamRules() {
        return this.client.v2.streamRules();
    }

    async addStreamRules(rules: Array<{ value: string; tag?: string }>) {
        return this.client.v2.updateStreamRules({ add: rules });
    }

    async deleteStreamRules(ids: string[]) {
        return this.client.v2.updateStreamRules({ delete: { ids } });
    }

    async getStreamClient() {
        return this.client.v2.searchStream({
            expansions: ['author_id'],
            'tweet.fields': ['created_at']
        });
    }
}

export default TwitterClient;