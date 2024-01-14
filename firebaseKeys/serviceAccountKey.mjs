import dotenv from 'dotenv';
dotenv.config();

const serviceAccount = {
    "type": process.env.type,
    "project_id": process.env.project_id,
    "private_key_id": process.env.private_key_id,
    "private_key": "-----BEGIN PRIVATE KEY-----\n" +
    process.env.private_key1+"\n" +
    process.env.private_key2+"\n" +
    process.env.private_key3+"\n" +
    process.env.private_key4+"\n" +
    process.env.private_key5+"\n" +
    process.env.private_key6+"\n" +
    process.env.private_key7+"\n" +
    process.env.private_key8+"\n" +
    process.env.private_key9+"\n" +
    process.env.private_key10+"\n" +
    process.env.private_key11+"\n" +
    process.env.private_key12+"\n" +
    process.env.private_key13+"\n" +
    process.env.private_key14+"\n" +
    process.env.private_key15+"\n" +
    process.env.private_key16+"\n" +
    process.env.private_key17+"\n" +
    process.env.private_key18+"\n" +
    process.env.private_key19+"\n" +
    process.env.private_key20+"\n" +
    process.env.private_key21+"\n" +
    process.env.private_key22+"\n" +
    process.env.private_key23+"\n" +
    process.env.private_key24+"\n" +
    process.env.private_key25+"\n" +
    process.env.private_key26+"\n" +
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
