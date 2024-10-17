// src/utils/phoneUtils.js
function formatPhoneNumber(phoneNumber) {
    // Adiciona o dígito '9' após o código de área '31'
    if (phoneNumber.startsWith('5531') && phoneNumber.length === 12) {
        const formatted = phoneNumber.slice(0, 4) + '9' + phoneNumber.slice(4);
        /* console.log(`Número original: ${phoneNumber}, Número formatado: ${formatted}`); */
        return formatted;
    }
}

function validatePhoneNumber(phoneNumber) {
    const re = /^\d{10,11}$/;
    return re.test(phoneNumber);
}

function removeExtraNine(phoneNumber) {
    // Verifica se o número começa com '55319' e tem 13 dígitos (incluindo o '9' extra)
    if (phoneNumber.startsWith('55319') && phoneNumber.length === 13) {
        // Remove o dígito '9' que está após o código de área
        const formatted = phoneNumber.slice(0, 4) + phoneNumber.slice(5);
        return formatted;
    }
}


module.exports = { formatPhoneNumber , validatePhoneNumber, removeExtraNine };



