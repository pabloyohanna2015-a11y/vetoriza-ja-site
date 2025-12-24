const fetch = require('node-fetch');

exports.handler = async (event) => {
    const paymentId = event.queryStringParameters.id;
    const token = process.env.MP_ACCESS_TOKEN;

    if (!paymentId) {
        return { statusCode: 400, body: JSON.stringify({ error: 'ID do pagamento ausente' }) };
    }

    try {
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        // Retorna o status real do pagamento (approved, pending, rejected, etc.)
        return {
            statusCode: 200,
            body: JSON.stringify({ status: data.status })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro ao consultar pagamento' })
        };
    }
};
