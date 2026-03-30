import ssl
import socket

# 1. TLS/SSL Connection
def scan_domain(domain):
    context = ssl.create_default_context()

    try:
        with socket.create_connection((domain, 443), timeout=5) as sock:
            with context.wrap_socket(sock, server_hostname=domain) as ssock:
                
                tls_version = ssock.version()
                cipher_info = ssock.cipher()

                return {
                    "tls": tls_version,
                    "cipher": cipher_info[0],
                    "key_bits": cipher_info[2]
                }

    except Exception as e:
        return {"error": str(e)}


# 2. Vulnerability Detection
def analyze_security(data):
    issues = []
    risk = "Low"

    tls = data.get("tls", "")
    cipher = data.get("cipher", "")
    key_bits = data.get("key_bits", 0)

    if tls in ["TLSv1", "TLSv1.1"]:
        risk = "High"
        issues.append("Outdated TLS version")

    if "RC4" in cipher or "DES" in cipher:
        risk = "High"
        issues.append("Weak cipher")

    if key_bits < 2048:
        issues.append("Weak key size")
        if risk != "High":
            risk = "Medium"

    return risk, issues


# 3. PQC Readiness Checker
def pqc_check(cipher):
    if "RSA" in cipher or "ECDHE" in cipher:
        return "Not Quantum Safe"
    else:
        return "Possibly PQC Ready"


# 4. Final Scanner
def full_scan(domain):
    scan = scan_domain(domain)

    if "error" in scan:
        return scan

    risk, issues = analyze_security(scan)
    pqc_status = pqc_check(scan["cipher"])

    return {
        "domain": domain,
        "tls": scan["tls"],
        "cipher": scan["cipher"],
        "key_bits": scan["key_bits"],
        "risk": risk,
        "issues": issues,
        "pqc_status": pqc_status
    }


# Run Example
if __name__ == "__main__":
    domain = input("Enter domain: ")
    result = full_scan(domain)

    print("\nScan Result:")
    for key, value in result.items():
        print(f"{key}: {value}")