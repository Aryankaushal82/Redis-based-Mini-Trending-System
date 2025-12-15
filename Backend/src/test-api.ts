async function testTrendingApi() {
    try {
        const res = await fetch('http://localhost:3000/api/v1/topics/trending');
        const data = await res.json();
        console.log("Trending API Response:", JSON.stringify(data, null, 2));
    } catch (error: any) {
        console.error("Error fetching trending:", error.message);
    }
}

testTrendingApi();
