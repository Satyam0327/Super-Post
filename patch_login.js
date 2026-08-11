const fs = require('fs');
let content = fs.readFileSync('src/pages/Login.tsx', 'utf8');

// Add useEffect import
if (!content.includes('useEffect')) {
    content = content.replace('import React, { useState }', 'import React, { useState, useEffect }');
}

// Add onAuthStateChanged import if needed
if (!content.includes('onAuthStateChanged')) {
    content = content.replace('import { signInWithEmailAndPassword, signInWithPopup } from \'firebase/auth\';', 'import { signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from \'firebase/auth\';');
}

// Add useEffect inside Login component
const useEffectCode = `
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [navigate]);
`;

if (!content.includes('onAuthStateChanged(auth, (user)')) {
    content = content.replace('const navigate = useNavigate();', 'const navigate = useNavigate();\n' + useEffectCode);
}

fs.writeFileSync('src/pages/Login.tsx', content);
