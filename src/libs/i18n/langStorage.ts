export default {
    setLang(lang: string) {
        window.localStorage.setItem('user_lang', lang)
    },
    getLang(defaultLang: string) {
        let localLang: string | null = window.localStorage.getItem('user_lang')
        if (localLang === null) {
            return defaultLang
        } else {
            return localLang
        }

    }
}