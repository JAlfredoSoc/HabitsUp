const crypto = require("node:crypto");

const DEFAULT_SECRET =
  process.env.JWT_SECRET || "secret_key_de_pruebas_automatizadas_upc_2026";

function base64UrlEncode(input) {
  const buffer = Buffer.isBuffer(input)
    ? input
    : Buffer.from(typeof input === "string" ? input : JSON.stringify(input));
  return buffer
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecodeToString(input) {
  let base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf8");
}

class JwtHelper {
  static generarToken(payload, secret = DEFAULT_SECRET, expiresInSeconds = 86400) {
    const header = { alg: "HS256", typ: "JWT" };
    const now = Math.floor(Date.now() / 1000);
    const fullPayload = {
      ...payload,
      iat: now,
      exp: now + expiresInSeconds,
    };

    const encodedHeader = base64UrlEncode(header);
    const encodedPayload = base64UrlEncode(fullPayload);
    const signingInput = `${encodedHeader}.${encodedPayload}`;

    const signature = crypto
      .createHmac("sha256", secret)
      .update(signingInput)
      .digest();
    const encodedSignature = base64UrlEncode(signature);

    return `${signingInput}.${encodedSignature}`;
  }

  static verificarToken(token, secret = DEFAULT_SECRET) {
    if (!token || typeof token !== "string") {
      throw new Error("Token no proporcionado");
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Formato de token inválido");
    }

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const signingInput = `${encodedHeader}.${encodedPayload}`;

    const expectedSignature = base64UrlEncode(
      crypto.createHmac("sha256", secret).update(signingInput).digest()
    );

    if (encodedSignature !== expectedSignature) {
      throw new Error("Firma de token inválida");
    }

    const payload = JSON.parse(base64UrlDecodeToString(encodedPayload));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && now > payload.exp) {
      throw new Error("Token expirado");
    }

    return payload;
  }

  static extraerTokenDeHeader(authHeader) {
    if (!authHeader || typeof authHeader !== "string") {
      return null;
    }
    if (authHeader.startsWith("Bearer ")) {
      return authHeader.slice(7).trim();
    }
    return authHeader.trim();
  }
}

module.exports = JwtHelper;
