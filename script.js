const MIN = 100;
const MAX = 999;
const pinInput = document.getElementById('pin');
const sha256HashView = document.getElementById('sha256-hash');
const resultView = document.getElementById('result');
const pinDisplay = document.getElementById('pin-display');  // To display the current input

// Function to store data in localStorage
function store(key, value) {
  localStorage.setItem(key, value);
}

// Function to retrieve data from localStorage
function retrieve(key) {
  return localStorage.getItem(key);
}

// Generate a random number between 100 and 999
function getRandomArbitrary(min, max) {
  let cached;
  cached = Math.random() * (max - min) + min;
  cached = Math.floor(cached);
  return cached;
}

// Clear localStorage
function clear() {
  localStorage.clear();
}

// Function to generate the SHA256 hash of a given string
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Get SHA256 hash from localStorage or generate a new one
async function getSHA256Hash() {
  let cached = retrieve('sha256');
  if (cached) {
    return cached;
  }

  cached = await sha256(getRandomArbitrary(MIN, MAX));
  store('sha256', cached);
  return cached;
}

// Function to check if the user's input matches the generated hash
async function test() {
  const pin = pinInput.value;

  if (pin.length !== 3) {
    resultView.innerHTML = '💡 Please enter a 3-digit number';
    resultView.classList.remove('hidden');
    return;
  }

  const sha256Hash = sha256HashView.innerHTML;
  const hashedPin = await sha256(pin);

  if (hashedPin === sha256Hash) {
    resultView.innerHTML = '🎉 Success';
    resultView.classList.add('success');
  } else {
    resultView.innerHTML = '❌ Failed';
  }
  resultView.classList.remove('hidden');
}

// Set up event listeners for user input
pinInput.addEventListener('input', (e) => {
  const { value } = e.target;
  pinInput.value = value.replace(/\D/g, '').slice(0, 3);  // Allow only 3 digits

  // Display the current value as the user types
  pinDisplay.innerHTML = `Current PIN: ${pinInput.value}`;
});

document.getElementById('check').addEventListener('click', test);

// Display SHA256 hash on the page
async function main() {
  sha256HashView.innerHTML = 'Calculating...';
  const hash = await getSHA256Hash();
  sha256HashView.innerHTML = hash;
}

main();
