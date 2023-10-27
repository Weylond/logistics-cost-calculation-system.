export default function checkPassword(password: string): boolean {
    if (password.length < 8 || password.length > 64) {
        return false;
    }
    
    const containsCyrillic = /[а-яА-Я]/.test(password);
        if (containsCyrillic) {
        return false;
    }

    const containsSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    if (!containsSpecial) {
        return false;
    }

    const containsDigit = /\d/.test(password);
    if (!containsDigit) {
        return false;
    }

    return true;
}