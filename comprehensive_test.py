import urllib.request
import urllib.parse
import json
import time
import urllib.error

BASE_URL = "http://localhost:8081"
AUTH_URL = f"{BASE_URL}/api/auth"
USER_URL = f"{BASE_URL}/api/users"
CONTENT_URL = f"{BASE_URL}/api" # Gateway maps /api/vaults directly

def print_result(name, success, details=""):
    status = "PASS" if success else "FAIL"
    print(f"[{status}] {name} {details}")

def make_request(url, method="GET", data=None, headers=None):
    if headers is None:
        headers = {}
    
    if data:
        data_bytes = json.dumps(data).encode('utf-8')
        headers['Content-Type'] = 'application/json'
    else:
        data_bytes = None

    req = urllib.request.Request(url, data=data_bytes, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as response:
            return {
                "status": response.status,
                "body": json.loads(response.read().decode('utf-8'))
            }
    except urllib.error.HTTPError as e:
        return {
            "status": e.code,
            "body": e.read().decode('utf-8')
        }
    except Exception as e:
        return {
            "status": 0,
            "body": str(e)
        }

def test_flow():
    print("Starting Comprehensive API Test (urllib)...")
    
    # 1. Register
    email = f"testuser_{int(time.time())}@example.com"
    username = f"user_{int(time.time())}"
    password = "password123"
    
    register_payload = {
        "email": email,
        "password": password,
        "username": username,
        "role": "LEARNER",
        "age": 25
    }
    
    r = make_request(f"{AUTH_URL}/register", method="POST", data=register_payload)
    print_result("Register", r['status'] in [200, 201], f"Status: {r['status']}")
    
    token = ""
    if r['status'] in [200, 201]:
        token = r['body'].get("token")

    # 2. Login
    login_payload = {
        "email": email, # Corrected: LoginRequest expects email
        "password": password
    }
    
    r_login = make_request(f"{AUTH_URL}/login", method="POST", data=login_payload)
    print_result("Login", r_login['status'] == 200, f"Status: {r_login['status']}")
    
    if r_login['status'] == 200:
        token = r_login['body'].get("token")
    elif not token:
        print("No token available from Register or Login. Aborting.")
        return

    print(f"Using token: {token[:20]}...")
    headers = {"Authorization": f"Bearer {token}"}

    # 3. Get User Profile
    r = make_request(f"{USER_URL}/me", headers=headers)
    print_result("Get Profile", r['status'] == 200, f"Status: {r['status']}")

    # 4. Get Vaults (Public)
    # Gateway maps /api/vaults -> content-service
    r = make_request(f"{CONTENT_URL}/vaults")
    print_result("Get Vaults", r['status'] == 200, f"Status: {r['status']}")
    vaults = []
    if r['status'] == 200:
        vaults = r['body']
        print(f"   Found {len(vaults)} vaults")

    # 5. Get Quests for a Vault (if any)
    if vaults:
        vault_id = vaults[0]['id']
        r = make_request(f"{CONTENT_URL}/quests?vaultId={vault_id}")
        print_result(f"Get Quests for Vault {vault_id}", r['status'] == 200, f"Status: {r['status']}")

if __name__ == "__main__":
    test_flow()
