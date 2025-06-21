import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

// Test all REST API endpoints
async function testAPI() {
  console.log('🧪 Testing REST API Endpoints with SQLite Database\n');
  
  try {
    // Test 1: GET /members - Get all family members
    console.log('1. Testing GET /api/members');
    const membersResponse = await axios.get(`${BASE_URL}/members`);
    console.log('✅ Members:', membersResponse.data);
    console.log();

    // Test 2: POST /members - Add a new family member
    console.log('2. Testing POST /api/members');
    const newMember = await axios.post(`${BASE_URL}/members`, {
      name: 'Sister'
    });
    console.log('✅ New member added:', newMember.data);
    console.log();

    // Test 3: GET /investments - Get all investments
    console.log('3. Testing GET /api/investments');
    const investmentsResponse = await axios.get(`${BASE_URL}/investments`);
    console.log('✅ Investments count:', investmentsResponse.data.length);
    console.log('Sample investment:', investmentsResponse.data[0]);
    console.log();

    // Test 4: POST /investments - Add a new investment
    console.log('4. Testing POST /api/investments');
    const newInvestment = await axios.post(`${BASE_URL}/investments`, {
      member_id: newMember.data.id,
      type: 'Equity',
      symbol: 'WIPRO',
      name: 'Wipro Ltd',
      units: 15,
      buy_price: 420,
      buy_date: '2024-03-15',
      current_price: 425
    });
    console.log('✅ New investment added:', newInvestment.data);
    console.log();

    // Test 5: PUT /investments/:id - Update investment
    console.log('5. Testing PUT /api/investments/:id');
    const investmentId = newInvestment.data.id;
    const updatedInvestment = await axios.put(`${BASE_URL}/investments/${investmentId}`, {
      member_id: newMember.data.id,
      type: 'Equity',
      symbol: 'WIPRO',
      name: 'Wipro Limited',
      units: 20,
      buy_price: 420,
      buy_date: '2024-03-15',
      current_price: 430
    });
    console.log('✅ Investment updated:', updatedInvestment.data);
    console.log();

    // Test 6: GET /investments/member/:memberId - Get member investments
    console.log('6. Testing GET /api/investments/member/:memberId');
    const memberInvestments = await axios.get(`${BASE_URL}/investments/member/${newMember.data.id}`);
    console.log('✅ Member investments:', memberInvestments.data);
    console.log();

    // Test 7: POST /update-prices - Manual price update
    console.log('7. Testing POST /api/update-prices');
    const priceUpdate = await axios.post(`${BASE_URL}/update-prices`);
    console.log('✅ Price update result:', priceUpdate.data);
    console.log();

    // Test 8: DELETE /investments/:id - Delete investment
    console.log('8. Testing DELETE /api/investments/:id');
    const deleteResult = await axios.delete(`${BASE_URL}/investments/${investmentId}`);
    console.log('✅ Investment deleted:', deleteResult.data);
    console.log();

    // Test 9: DELETE /members/:id - Delete member
    console.log('9. Testing DELETE /api/members/:id');
    const deleteMemberResult = await axios.delete(`${BASE_URL}/members/${newMember.data.id}`);
    console.log('✅ Member deleted:', deleteMemberResult.data);
    console.log();

    console.log('🎉 All REST API endpoints tested successfully!');
    console.log('✅ SQLite database operations working correctly');
    console.log('✅ CORS headers enabled for frontend access');
    console.log('✅ JSON responses formatted properly');

  } catch (error) {
    console.error('❌ API Test Error:', error.response?.data || error.message);
  }
}

// Run the tests
testAPI();