import dotenv from 'dotenv';
dotenv.config();

const serviceAccount = {
    "type": process.env.type,
    "project_id": process.env.project_id,
    "private_key_id": process.env.private_key_id,
    "private_key": "-----BEGIN PRIVATE KEY-----\n" +
    "MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCqn/WgsbSyT3va\n" +
    "DJ3nGPh9oV6QtK9I2aQeyPeE97IWT7Vl0Eg57QX+iHXDGubxxPzX9A/YmqlqSLVG\n" +
    "VdvW4B2RL55KMZtfNS6+wDHDvW01aTs3mEdqRU6LIea+LNi3idXdskDrRyzMn1fc\n" +
    "RgAb1BoefFBMhtA0Z+K6JgPEYQ42t1TVx7Xt8eAHmW5Cjw6ujKVF1SUhZEHjIu8W\n" +
    "mpaX/vG9cd7faeAR8wVWZHVf+io4B2D7yn2DLcyj8V/bTYqO7R0E+pyKLF8bU0Bp\n" +
    "AeR5EPlTHXcf51YXI8whXTBxad6Y/F0CwQ5MV83xMyGUkMENg9e7UeJC6zgKKJd7\n" +
    "kfFaKYupAgMBAAECggEANpNcq048GI7Q9EF13l3/2Ztclpecu4YV91zbwzXBSl6r\n" +
    "jInvGEwmzzARztrThQC3yVGBIgzyZJMmHH3JCDV+b5qWHHA6nNzze0MZh90Wye9D\n" +
    "aDh2m1jY0ysAVdMdbLOTa0qhdkA5ZagQH95qGXyh8B9eReQXQ7P48wbGzLEorTo4\n" +
    "HCD+HqP6THxaqVp2+F9ejJQcMHXfkZ8GOHgrdWdS4ZliVQ0+nqrcfjHfqjHZ++M0\n" +
    "PL1RmlQGjVvaWgRZyrQtjTwSH95GIyR+dtHNnv7+dD0huiFij9wMmSQlIymL0Pmw\n" +
    "fndbVosUB6e7E7sZe6yXPRWjv7WBZkEQrqfmOfQ2awKBgQDTgHflVDfpiiXhOMe0\n" +
    "wmzNJc/EHyxCQjj/ymm2FgJ7RH7ezpZG07fZubON2ix0R/k3aeinVl5fUpDTA0MF\n" +
    "947B2GGisQ390Z+zkVPsrzSKR7jcr5GgaC9nDIA+Fh3XPwH8hg4YpqPb2N+5Ds0Y\n" +
    "zZhhLWN5JmFstQHUtbfQdLB48wKBgQDOhdkmsgo14/vc1jqn22bRHzmrLdo7dnTo\n" +
    "CAkXGhSjvozFpihNCI1hqbeRYerlV8cu3VQ4Aw+dwmJ6JgOYjTVU+9BoxFWoq3Jn\n" +
    "Bfkaz0gr0CNPizThd7LmoIgwp2IlOoNU+aHukkxyGGCpcYhQrAvjRaqli7peB44T\n" +
    "2PaaVk2P8wKBgFa0nPJb80v/gYXyVBSrfBUiAinhqbBEG7/pSCsInN3R97z5riu9\n" +
    "EerlMVHe9kh5VRa9iU5Inwmu/IY1GR3yHgkj3urmcNj0PedMlb47GWvy+TsnkqjS\n" +
    "7VPukQhi4rriLrtKba73acdwAk+IXNZlOqnkBJqe/GOnVOfR01hW7h23AoGAFsr8\n" +
    "8WFa8SGtTW0zYg075r6cfcD8we1L78PbRPpy5rOEE9hHwGC+QdYaVWhKJW+vowN4\n" +
    "ZQopcg7fEX4ajX6gMTXthXKNxaTOZoJpQMU5wOQi0YeamXu9eeijv0Lp+RPhJMK8\n" +
    "VXk+CKWaHXlTQxwJ39Zzg/vM4M3Sp2wdo2D9BHMCgYA0dhZpvo6tj6mwdKdwJnfq\n" +
    "UHUVP46Ihl2qlZNZ1vDktCFYvGzWXmO6y4ph6xjYBr5VMdDc7zuk1ks+0xiEgZQh\n" +
    "WsAHQIZ0aczHNisDIj86glvbYCxYQ5WsUyLFJcLuTnB1PvrSYaTPUaSaNsEbUxq/\n" +
    "20Vi31ACoDhMHpZh0UPnoQ==\n" +
    "-----END PRIVATE KEY-----",
    "client_email": process.env.client_email,
    "client_id": process.env.client_id,
    "auth_uri": process.env.auth_uri,
    "token_uri": process.env.token_uri,
    "auth_provider_x509_cert_url": process.env.auth_provider_x509_cert_url,
    "client_x509_cert_url": process.env.client_x509_cert_url,
    "universe_domain": process.env.universe_domain
};
export default serviceAccount;
