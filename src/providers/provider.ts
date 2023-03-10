import { useAuthStore } from '@/stores/auth';

export default class Provider {
    static config() {
        const authStore = useAuthStore();
        const token = authStore.token;
        let config = {}

        if (token) {
            config = {
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            };
        }

        return config;
    }
}