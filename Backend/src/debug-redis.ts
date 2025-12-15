import { createClient } from 'redis';

const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => console.log('Redis Client Error', err));

async function debugTrending() {
    await client.connect();
    console.log("Connected to Redis");

    const topicName = "debug_test_" + Date.now();
    
    console.log(`1. Simulating post with hashtag #${topicName}`);
    
    // Simulate Post Controller Logic
    await client.zIncrBy("trending:topics", 1, topicName);
    await client.set(`topic:lastSeen:${topicName}`, new Date().toISOString(), { EX: 600 });
    
    console.log("2. Data written to Redis. Verifying keys...");
    
    const score = await client.zScore("trending:topics", topicName);
    console.log(`   - Score for ${topicName}: ${score}`);
    
    const lastSeen = await client.get(`topic:lastSeen:${topicName}`);
    console.log(`   - Last seen for ${topicName}: ${lastSeen}`);
    
    console.log("3. Simulating Get Trending Service Logic...");
    
    const raw = await client.zRangeWithScores("trending:topics", 0, 9, { REV: true });
    console.log("   - Raw ZRANGE result:", raw);
    
    const result = [];
    for (const item of raw) {
        const topic = item.value;
        const exists = await client.exists(`topic:lastSeen:${topic}`);
        console.log(`   - Checking ${topic}: exists=${exists}`);
        
        if (!exists) {
            console.log(`   - REMOVING ${topic} because lastSeen is missing`);
            // await client.zRem("trending:topics", topic); // Don't actually remove in debug
        } else {
            result.push({ topic, mentions: item.score });
        }
    }
    
    console.log("4. Final Result:", result);
    
    await client.disconnect();
}

debugTrending().catch(console.error);
