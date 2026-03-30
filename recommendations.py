def generate_recommendations(scan):

    rec = []

    if scan["tls"] == "TLS 1.0":
        rec.append("Upgrade TLS to TLS 1.3")

    if scan["algorithm"] == "RSA-1024":
        rec.append("Upgrade key size to RSA-3072")

    if scan["cipher"] == "AES-128":
        rec.append("Use AES-256 or ChaCha20")

    if scan["risk"] == "Critical":
        rec.append("Immediate security upgrade required")

    if len(rec) == 0:
        rec.append("System follows modern cryptographic standards")

    return rec