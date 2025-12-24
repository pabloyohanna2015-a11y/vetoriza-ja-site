const fetch = require('node-fetch');

exports.handler = async (event) => {
    // Pega o token que você salvou no cofre do Netlify
    const token = process.env.MP_ACCESS_TOKEN;

    const paymentData = {
        transaction_amount: 9.90,
        description: 'Vetorização Profissional - VetorizaJá',
        payment_method_id: 'pix',
        payer: {
            email: 'comprador@vetorizaja.com', // E-mail fixo para teste
            first_name: 'Cliente',
            last_name: 'VetorizaJá'
        }
    };

    try {
        const response = await fetch('https://api.mercadopago.com/v1/payments', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-Idempotency-Key': Math.random().toString(36).substring(7)
            },
            body: JSON.stringify(paymentData)
        });

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify({
                id: data.id,
                qr_code: data.point_of_interaction.transaction_data.qr_code,
                qr_code_base64: data.point_of_interaction.transaction_data.qr_code_base64
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro ao gerar Pix' })
        };
    }
};
