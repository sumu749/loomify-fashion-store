interface SslCommerzConfig {
    storeId: string;
    storePassword: string;
    baseUrl: string;
}

interface PaymentDetails {
    amount: number;
    transactionId: string;
    callbackToken: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    address: string;
    city: string;
    district: string;
    postalCode: string;
    country: string;
    itemCount: number;
}

const getConfig = (): SslCommerzConfig => {
    const storeId = process.env.SSLCOMMERZ_STORE_ID;
    const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;

    if (!storeId || !storePassword) {
        throw new Error("SSLCommerz is not configured.");
    }

    return {
        storeId,
        storePassword,
        baseUrl:
            process.env.SSLCOMMERZ_IS_LIVE === "true"
                ? "https://securepay.sslcommerz.com"
                : "https://sandbox.sslcommerz.com",
    };
};

export const isSslCommerzConfigured = () =>
    Boolean(
        process.env.SSLCOMMERZ_STORE_ID &&
        process.env.SSLCOMMERZ_STORE_PASSWORD,
    );

export const initializeSslCommerzPayment = async (details: PaymentDetails) => {
    const config = getConfig();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const callbackUrl = new URL("/api/payments/sslcommerz/callback", appUrl);
    const callbackUrlFor = (result: string) => {
        const url = new URL(callbackUrl);
        url.searchParams.set("result", result);
        url.searchParams.set("token", details.callbackToken);
        return url.toString();
    };

    const address = details.address || details.district || "Bangladesh";
    const payload = new URLSearchParams({
        store_id: config.storeId,
        store_passwd: config.storePassword,
        total_amount: details.amount.toFixed(2),
        currency: "BDT",
        tran_id: details.transactionId,
        success_url: callbackUrlFor("success"),
        fail_url: callbackUrlFor("failed"),
        cancel_url: callbackUrlFor("cancelled"),
        ipn_url: callbackUrlFor("success"),
        shipping_method: "YES",
        product_name: "Loomify fashion order",
        product_category: "Fashion",
        product_profile: "physical-goods",
        num_of_item: String(details.itemCount),
        cus_name: details.customerName,
        cus_email: details.customerEmail,
        cus_phone: details.customerPhone,
        cus_add1: address,
        cus_city: details.city,
        cus_postcode: details.postalCode,
        cus_country: details.country,
        ship_name: details.customerName,
        ship_add1: address,
        ship_city: details.city,
        ship_postcode: details.postalCode,
        ship_country: details.country,
    });

    const response = await fetch(`${config.baseUrl}/gwprocess/v4/api.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: payload,
    });

    const result = (await response.json()) as {
        status?: string;
        GatewayPageURL?: string;
    };

    if (!response.ok || result.status !== "SUCCESS" || !result.GatewayPageURL) {
        throw new Error("Could not start the SSLCommerz payment session.");
    }

    return result.GatewayPageURL;
};

export const validateSslCommerzPayment = async (validationId: string) => {
    const config = getConfig();
    const url = new URL(
        `${config.baseUrl}/validator/api/validationserverAPI.php`,
    );

    url.searchParams.set("val_id", validationId);
    url.searchParams.set("store_id", config.storeId);
    url.searchParams.set("store_passwd", config.storePassword);
    url.searchParams.set("format", "json");

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Could not verify the SSLCommerz payment.");
    }

    return (await response.json()) as {
        status?: string;
        tran_id?: string;
        amount?: string;
        currency?: string;
        bank_tran_id?: string;
    };
};
