async function testAuth() {
    try {
        console.log('Testing Registration...');

        // Test 1: Register new user
        const registerRes = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullname: 'Test User',
                email: 'testauth@example.com',
                password: 'testpass123',
            }),
        });

        const registerData = await registerRes.json();
        console.log('✓ Registration Response:', registerData);
        console.log('✓ Status Code:', registerRes.status);
        console.log('✓ Set-Cookie Header:', registerRes.headers.get('set-cookie'));

        if (!registerRes.ok) {
            console.error('✗ Registration failed');
            return;
        }

        // Test 2: Try to access protected route without token
        console.log('\nTesting Protected Route (without token)...');
        const noTokenRes = await fetch('http://localhost:3000/api/auth/me', {
            headers: { 'Content-Type': 'application/json' },
        });
        console.log('✓ Response Status:', noTokenRes.status, '(should be 401)');

        // Test 3: Validate form errors
        console.log('\nTesting Form Validation...');
        const invalidRes = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullname: 'Test',
                email: 'invalid-email',
                password: 'short',
            }),
        });
        const invalidData = await invalidRes.json();
        console.log('✓ Validation Response:', invalidData.message);

        // Test 4: Duplicate email
        console.log('\nTesting Duplicate Email...');
        const dupRes = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullname: 'Duplicate Test',
                email: 'testauth@example.com',
                password: 'testpass123',
            }),
        });
        const dupData = await dupRes.json();
        console.log('✓ Duplicate Response:', dupData.message);
        console.log('✓ Status Code:', dupRes.status, '(should be 409)');

        console.log('\n✅ All tests completed');
    } catch (error) {
        console.error('❌ Test error:', error.message);
    }
}

testAuth();
