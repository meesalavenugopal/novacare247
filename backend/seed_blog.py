"""
Seed script for blog articles
Run this to populate the database with initial blog content
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal
from app.models import BlogArticle
import json

def seed_blog_articles():
    db = SessionLocal()
    
    # Check if articles already exist
    existing = db.query(BlogArticle).count()
    if existing > 0:
        print(f"Blog already has {existing} articles. Skipping seed.")
        db.close()
        return
    
    articles = [
        {
            "title": "Lower Back Pain: Causes, Symptoms & Physiotherapy Treatment",
            "slug": "lower-back-pain-causes-treatment",
            "excerpt": "Discover the common causes of lower back pain and how physiotherapy can provide lasting relief without surgery or medication.",
            "category": "conditions",
            "author": "Dr. Priya Sharma",
            "author_role": "Senior Physiotherapist",
            "read_time": "8 min read",
            "is_featured": True,
            "image": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
            "tags": ["back pain", "spine", "posture", "physiotherapy"],
            "content": """## Understanding Lower Back Pain

Lower back pain is one of the most common reasons people visit a physiotherapist. It affects approximately 80% of adults at some point in their lives. At NovaCare, we specialize in diagnosing and treating all types of back pain.

### Common Causes of Lower Back Pain

**1. Muscle Strain**
The most frequent cause of acute lower back pain. This occurs when muscles are overstretched or torn due to:
- Heavy lifting with poor technique
- Sudden movements or twisting
- Prolonged sitting with poor posture
- Lack of regular exercise

**2. Herniated or Bulging Disc**
The soft cushions between vertebrae can bulge or rupture, pressing on nearby nerves. Symptoms include:
- Sharp, shooting pain down the leg (sciatica)
- Numbness or tingling in legs
- Weakness in leg muscles

**3. Degenerative Disc Disease**
As we age, spinal discs naturally wear down, leading to:
- Chronic, dull aching pain
- Stiffness, especially in the morning
- Pain that worsens with sitting

### How Physiotherapy Helps

At NovaCare, our evidence-based approach to treating lower back pain includes:

**Manual Therapy**
- Spinal mobilization and manipulation
- Soft tissue massage
- Myofascial release techniques

**Exercise Therapy**
- Core strengthening exercises
- Flexibility and stretching programs
- Posture correction exercises

**Education & Prevention**
- Ergonomic advice for work and home
- Lifting techniques
- Long-term self-management strategies

### When to Seek Help

Visit a physiotherapist if you experience:
- Pain lasting more than 2 weeks
- Pain that radiates down your leg
- Numbness, tingling, or weakness
- Pain that disrupts sleep

Book an appointment today and take the first step toward a pain-free life.""",
            "faqs": [
                {
                    "question": "How long does it take to recover from lower back pain?",
                    "answer": "Most acute lower back pain improves within 2-4 weeks with proper physiotherapy. Chronic conditions may take 8-12 weeks of consistent treatment."
                },
                {
                    "question": "Can I exercise with lower back pain?",
                    "answer": "Yes, in most cases gentle exercise is beneficial. Your physiotherapist will design a safe exercise program specific to your condition."
                },
                {
                    "question": "Is bed rest recommended for back pain?",
                    "answer": "No, prolonged bed rest is not recommended. Staying active promotes faster healing and prevents muscle weakening."
                }
            ]
        },
        {
            "title": "Neck Pain in Office Workers: Prevention & Treatment Guide",
            "slug": "neck-pain-office-workers",
            "excerpt": "Working at a desk all day? Learn how to prevent and treat neck pain with expert physiotherapy tips and exercises.",
            "category": "conditions",
            "author": "Dr. Rahul Mehta",
            "author_role": "Orthopedic Physiotherapist",
            "read_time": "7 min read",
            "is_featured": True,
            "image": "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80",
            "tags": ["neck pain", "office ergonomics", "posture", "desk job"],
            "content": """## The Epidemic of Neck Pain in Office Workers

In today's digital age, neck pain has become increasingly common among office workers. Hours spent hunched over computers takes a significant toll on our cervical spine.

### Why Office Workers Are Prone to Neck Pain

**Text Neck Syndrome**
Looking down at screens puts tremendous strain on neck muscles. For every inch your head moves forward, the effective weight on your neck increases by 10 pounds.

**Poor Workstation Setup**
- Monitor too low or too high
- Keyboard and mouse placement issues
- Chair without proper support

### Ergonomic Workstation Tips

**Monitor Position**
- Top of screen at eye level
- 20-26 inches from eyes
- Directly in front, not off to the side

**Chair Setup**
- Feet flat on floor
- Knees at 90 degrees
- Lower back supported

### Office-Friendly Stretches

Perform these every 30-60 minutes:

**Chin Tucks**
Gently pull your chin back, creating a "double chin." Hold for 5 seconds, repeat 10 times.

**Neck Rotations**
Slowly turn head left, hold 5 seconds. Repeat right. Do 5 each side.

**Shoulder Shrugs**
Raise shoulders to ears, hold 5 seconds, release. Repeat 10 times.

### When to See a Physiotherapist

Seek professional help if:
- Pain persists beyond 2 weeks
- Pain radiates to arms or hands
- You experience numbness or tingling
- Headaches accompany neck pain""",
            "faqs": [
                {
                    "question": "How often should I take breaks from my desk?",
                    "answer": "Follow the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds. Take a 5-minute movement break every hour."
                },
                {
                    "question": "Can a standing desk help with neck pain?",
                    "answer": "Standing desks can help by encouraging movement. However, proper monitor height and alternating between sitting and standing are key."
                }
            ]
        },
        {
            "title": "10 Best Stretches for Back Pain Relief",
            "slug": "10-stretches-back-pain-relief",
            "excerpt": "Simple stretching exercises you can do at home to relieve back pain. Recommended by physiotherapists at NovaCare.",
            "category": "exercises",
            "author": "Dr. Anjali Patel",
            "author_role": "Sports Physiotherapist",
            "read_time": "10 min read",
            "is_featured": True,
            "image": "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
            "tags": ["stretches", "exercises", "back pain", "home exercises"],
            "content": """## Effective Stretches for Back Pain

Regular stretching can significantly reduce back pain and prevent future episodes. These physiotherapist-approved stretches target key muscle groups.

### Before You Start

**Important Guidelines:**
- Never stretch to the point of pain
- Hold each stretch for 30 seconds
- Breathe deeply and relax into the stretch
- Perform stretches on both sides

### 1. Cat-Cow Stretch

**Target:** Entire spine, promotes mobility

1. Start on hands and knees
2. Inhale: Drop belly toward floor, lift head and tailbone (Cow)
3. Exhale: Round spine toward ceiling, tuck chin and pelvis (Cat)
4. Flow between positions 10-15 times

### 2. Child's Pose

**Target:** Lower back, hips, thighs

1. Kneel on floor, big toes touching, knees apart
2. Sit back on heels
3. Walk hands forward, lowering chest toward floor
4. Hold 30-60 seconds

### 3. Knee-to-Chest Stretch

**Target:** Lower back, glutes

1. Lie on back, legs extended
2. Bring one knee toward chest
3. Hold 30 seconds, switch sides
4. Then pull both knees to chest

### 4. Piriformis Stretch (Figure 4)

**Target:** Piriformis, glutes (helps sciatica)

1. Lie on back, knees bent
2. Cross right ankle over left knee
3. Pull left thigh toward chest
4. Hold 30 seconds, switch sides

### 5. Supine Twist

**Target:** Lower back rotation

1. Lie on back, arms in T-position
2. Bend knees, feet flat
3. Lower both knees to one side
4. Hold 30 seconds, switch sides

### Creating Your Routine

**Morning Routine (5 minutes):**
Cat-Cow, Child's Pose, Pelvic Tilts

**Evening Routine (10 minutes):**
All stretches

Book an appointment if pain persists despite regular stretching.""",
            "faqs": [
                {
                    "question": "How often should I do these stretches?",
                    "answer": "For best results, perform these stretches daily. Even 5-10 minutes can make a significant difference."
                },
                {
                    "question": "Can stretching make back pain worse?",
                    "answer": "If done incorrectly or too aggressively, yes. Always stay within a comfortable range and stop if you feel sharp pain."
                }
            ]
        },
        {
            "title": "Complete Guide to Sports Injury Recovery",
            "slug": "sports-injury-recovery-guide",
            "excerpt": "From sprains to muscle tears - learn how to recover from sports injuries faster and get back to your game.",
            "category": "sports",
            "author": "Dr. Arjun Reddy",
            "author_role": "Sports Rehabilitation Specialist",
            "read_time": "12 min read",
            "is_featured": True,
            "image": "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80",
            "tags": ["sports injury", "recovery", "rehabilitation", "athletes"],
            "content": """## Getting Back in the Game: Sports Injury Recovery

Sports injuries are frustrating for any athlete. Understanding the recovery process can significantly speed up your return to activity.

### Common Sports Injuries

**Sprains (Ligament Injuries)**
- Ankle sprains (most common)
- ACL/MCL injuries (knee)

**Strains (Muscle/Tendon Injuries)**
- Hamstring strains
- Calf muscle tears
- Rotator cuff injuries

**Overuse Injuries**
- Tennis elbow
- Runner's knee
- Shin splints

### The PRICE Protocol (First 48-72 Hours)

**P - Protection:** Stop activity immediately
**R - Rest:** Allow healing
**I - Ice:** 15-20 minutes every 2-3 hours
**C - Compression:** Reduce swelling
**E - Elevation:** Above heart level

### Phases of Rehabilitation

**Phase 1: Acute Phase (Days 1-7)**
- PRICE protocol
- Gentle range of motion
- Pain management

**Phase 2: Subacute Phase (Weeks 1-3)**
- Progressive stretching
- Isometric exercises
- Balance training begins

**Phase 3: Remodeling Phase (Weeks 3-6+)**
- Progressive resistance training
- Sport-specific exercises
- Agility training

**Phase 4: Return to Sport**
- Functional testing
- Gradual return to practice
- Full clearance

### Why Choose Physiotherapy

At NovaCare, our sports physiotherapists offer:
- Accurate diagnosis
- Evidence-based treatment
- Sport-specific rehab
- Injury prevention
- Performance optimization""",
            "faqs": [
                {
                    "question": "How soon can I return to sports after an injury?",
                    "answer": "It depends on injury severity. Minor sprains: 1-2 weeks. ACL tears: 6-9 months. Your physiotherapist will guide safe return."
                },
                {
                    "question": "Should I use heat or ice?",
                    "answer": "Ice for acute injuries (first 48-72 hours). Heat later to promote blood flow. Consult your physiotherapist for specific advice."
                }
            ]
        },
        {
            "title": "Knee Strengthening Exercises for Pain Relief",
            "slug": "knee-strengthening-exercises",
            "excerpt": "Build stronger knees with these physiotherapist-recommended exercises. Perfect for arthritis, injuries, and prevention.",
            "category": "exercises",
            "author": "Dr. Vikram Singh",
            "author_role": "Orthopedic Physiotherapist",
            "read_time": "9 min read",
            "is_featured": False,
            "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
            "tags": ["knee pain", "exercises", "strengthening", "arthritis"],
            "content": """## Building Stronger, Pain-Free Knees

Strong muscles around the knee are essential for joint stability. These exercises can help with injuries, arthritis, or prevention.

### Key Muscle Groups

- **Quadriceps** (front of thigh)
- **Hamstrings** (back of thigh)
- **Glutes** (buttocks)
- **Calf muscles**

### Beginner Exercises

**1. Straight Leg Raises**
1. Lie on back, one leg bent, one straight
2. Lift straight leg to height of bent knee
3. Hold 3 seconds, lower slowly
4. Repeat 10-15 times each leg

**2. Wall Squats**
1. Stand with back against wall
2. Slide down until knees at 45-60 degrees
3. Hold 10-30 seconds
4. Repeat 5-10 times

**3. Clamshells**
1. Lie on side, knees bent
2. Keep feet touching, lift top knee
3. Hold 2 seconds, lower
4. Repeat 15-20 times each side

### Exercise Guidelines

**Frequency:** 3-4 times per week
**Sets:** 2-3 sets of each exercise
**Progression:** Increase reps before adding resistance

See a physiotherapist if pain persists or worsens with exercise.""",
            "faqs": [
                {
                    "question": "Can I do these with knee arthritis?",
                    "answer": "Yes, most are beneficial for arthritis. Start with low reps and avoid deep bending if it causes pain."
                },
                {
                    "question": "How long until I see improvement?",
                    "answer": "With consistent exercise 3-4 times per week, most people notice improvement in 4-6 weeks."
                }
            ]
        },
        {
            "title": "Sciatica: Causes, Symptoms & Treatment",
            "slug": "sciatica-complete-guide",
            "excerpt": "Everything you need to know about sciatica - the shooting leg pain that affects millions.",
            "category": "conditions",
            "author": "Dr. Priya Sharma",
            "author_role": "Senior Physiotherapist",
            "read_time": "9 min read",
            "is_featured": False,
            "image": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
            "tags": ["sciatica", "nerve pain", "leg pain", "spine"],
            "content": """## Understanding Sciatica

Sciatica refers to pain that radiates along the sciatic nerve, from your lower back through your hips and down each leg.

### What Causes Sciatica?

**Herniated Disc (Most Common)**
When the soft center of a spinal disc presses on the nerve.

**Spinal Stenosis**
Narrowing of the spinal canal.

**Piriformis Syndrome**
The piriformis muscle irritates the sciatic nerve.

### Symptoms

- Pain radiating from lower back through buttock and down leg
- Pain that worsens with sitting
- Burning or tingling sensation
- Weakness or numbness in leg

### Physiotherapy Treatment

**Manual Therapy**
- Spinal mobilization
- Soft tissue massage
- Neural mobilization

**Exercise Therapy**
- Nerve gliding exercises
- Core stabilization
- Stretching tight muscles

### Exercises for Relief

**1. Knee to Chest Stretch**
Gently pull knee toward chest, hold 30 seconds

**2. Piriformis Stretch**
Figure-4 stretch, hold 30 seconds each side

**3. Sciatic Nerve Glide**
Seated, straighten leg, flex/point foot

Most sciatica cases resolve in 4-6 weeks with proper treatment.""",
            "faqs": [
                {
                    "question": "Is walking good for sciatica?",
                    "answer": "Gentle walking is often beneficial as it promotes blood flow. However, stop if it worsens your pain."
                },
                {
                    "question": "Can sciatica go away on its own?",
                    "answer": "Mild sciatica may improve on its own, but physiotherapy significantly speeds recovery and prevents recurrence."
                }
            ]
        },
        {
            "title": "Post-Surgery Rehabilitation Guide",
            "slug": "post-surgery-rehabilitation-guide",
            "excerpt": "Essential guide to physiotherapy after surgery. Learn about recovery timelines and tips for optimal healing.",
            "category": "recovery",
            "author": "Dr. Meera Krishnan",
            "author_role": "Post-Operative Rehabilitation Specialist",
            "read_time": "11 min read",
            "is_featured": False,
            "image": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
            "tags": ["surgery recovery", "rehabilitation", "post-operative", "healing"],
            "content": """## Your Guide to Post-Surgery Rehabilitation

Surgery is often just the first step in recovery. What you do afterward plays a crucial role in achieving the best outcome.

### Why Post-Surgery Physiotherapy Matters

After surgery, your body faces:
- Tissue healing
- Muscle weakness
- Joint stiffness
- Altered movement patterns

### General Recovery Timeline

**Week 1-2: Acute Phase**
- Gentle movements
- Breathing exercises
- Swelling management

**Weeks 2-6: Early Rehabilitation**
- Range of motion exercises
- Light strengthening
- Gait training

**Weeks 6-12: Progressive Strengthening**
- Resistance training
- Balance exercises
- Increased activity

### Tips for Optimal Recovery

1. **Follow Your Protocol** - Guidelines exist for good reason
2. **Don't Skip Sessions** - Regular physio ensures proper progress
3. **Do Home Exercises** - What you do between sessions matters
4. **Manage Pain Appropriately** - Communicate with your team
5. **Prioritize Sleep & Nutrition** - Your body heals during rest

Our specialized post-operative rehabilitation includes coordination with your surgical team.""",
            "faqs": [
                {
                    "question": "When should I start physiotherapy after surgery?",
                    "answer": "This varies by surgery. Some begin within 24 hours (joint replacement), others wait 2-6 weeks. Your surgeon will specify."
                },
                {
                    "question": "How long will I need physiotherapy?",
                    "answer": "Duration depends on surgery type. Joint replacements: 3-6 months. ACL: 6-9 months. Rotator cuff: 4-6 months."
                }
            ]
        },
        {
            "title": "Preventing Workplace Injuries: Ergonomics Guide",
            "slug": "preventing-workplace-injuries",
            "excerpt": "Protect yourself from common workplace injuries with proper ergonomics and simple exercises.",
            "category": "prevention",
            "author": "Dr. Sanjay Kumar",
            "author_role": "Occupational Physiotherapist",
            "read_time": "8 min read",
            "is_featured": False,
            "image": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
            "tags": ["ergonomics", "workplace", "prevention", "desk exercises"],
            "content": """## Staying Injury-Free at Work

Workplace injuries are surprisingly common. Many can be prevented with proper ergonomics and regular movement.

### Common Workplace Injuries

- Carpal tunnel syndrome
- Neck and shoulder pain
- Lower back pain
- Tennis elbow

### Ergonomic Setup

**Chair**
- Feet flat on floor
- Lumbar support
- Armrests at elbow height

**Monitor**
- Top at eye level
- 20-26 inches away
- No glare

**Keyboard & Mouse**
- Elbows at 90 degrees
- Wrists neutral
- Mouse close to keyboard

### Desk Exercises

**Every 30 Minutes:**
- Shoulder rolls (5 each direction)
- Neck stretches (10 seconds each side)
- Wrist circles

**Every Hour:**
- Seated spinal twist
- Chest opener stretch
- Standing calf raises

**2-3 Times Daily:**
- Wall push-ups
- Squats
- Walking breaks

NovaCare offers corporate wellness services including ergonomic assessments.""",
            "faqs": [
                {
                    "question": "How often should I take breaks?",
                    "answer": "Micro-breaks every 20-30 minutes (stretch briefly) and longer breaks of 5-10 minutes every hour."
                },
                {
                    "question": "Is a standing desk better?",
                    "answer": "Neither prolonged sitting nor standing is ideal. Alternate between the two throughout the day."
                }
            ]
        },
        {
            "title": "Fix Your Posture: Complete Guide",
            "slug": "posture-improvement-complete-guide",
            "excerpt": "Poor posture causes pain and health issues. Learn how to assess and improve your posture.",
            "category": "lifestyle",
            "author": "Dr. Kavitha Rao",
            "author_role": "Posture & Alignment Specialist",
            "read_time": "10 min read",
            "is_featured": False,
            "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
            "tags": ["posture", "spine health", "alignment", "core strength"],
            "content": """## Understanding and Improving Your Posture

Good posture is about training your body to hold positions that place the least strain on muscles and ligaments.

### Why Posture Matters

**Health Impacts of Poor Posture:**
- Chronic neck and back pain
- Headaches
- Reduced lung capacity
- Fatigue

### Common Posture Problems

- Forward head posture
- Rounded shoulders
- Kyphosis (hunchback)
- Lordosis (swayback)

### Self-Assessment: Wall Test

1. Stand with back against wall
2. Heels 2-4 inches from wall
3. Buttocks, shoulders, head should touch wall
4. Check gap behind lower back

### Posture Exercises

**Chin Tucks**
Pull chin straight back, hold 5 seconds, repeat 10 times

**Wall Angels**
Arms at 90 degrees against wall, slide up and down

**Thoracic Extension**
Arch upper back over chair, hold 5 seconds

**Plank**
Hold 30-60 seconds for core strength

### Daily Tips

**Sitting:** Feet flat, back supported, screen at eye level
**Standing:** Weight balanced, core engaged
**Sleeping:** Supportive pillow, pillow between knees

With consistent effort, improvement takes 2-3 months.""",
            "faqs": [
                {
                    "question": "Can posture be corrected at any age?",
                    "answer": "Yes! Adults of all ages can improve posture with consistent exercise. Even people in their 60s-70s see improvements."
                },
                {
                    "question": "Do posture corrector devices work?",
                    "answer": "They can provide reminders but don't strengthen muscles. Long-term improvement requires exercise."
                }
            ]
        },
        {
            "title": "Shoulder Pain: Causes & Physiotherapy Solutions",
            "slug": "shoulder-pain-causes-treatment",
            "excerpt": "From frozen shoulder to rotator cuff injuries - understand what's causing your shoulder pain.",
            "category": "conditions",
            "author": "Dr. Rahul Mehta",
            "author_role": "Orthopedic Physiotherapist",
            "read_time": "8 min read",
            "is_featured": False,
            "image": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
            "tags": ["shoulder pain", "frozen shoulder", "rotator cuff", "physiotherapy"],
            "content": """## Understanding Shoulder Pain

The shoulder is one of the most mobile joints, making it vulnerable to various injuries and conditions.

### Common Shoulder Conditions

**Rotator Cuff Injuries**
Tears or inflammation of the stabilizing muscles and tendons.

**Frozen Shoulder**
Stiffness and pain that develops gradually.

**Shoulder Impingement**
Tendons become compressed during arm movements.

**Bursitis**
Inflammation of the fluid-filled sacs.

### Symptoms to Watch

- Pain with overhead movements
- Night pain
- Weakness when lifting
- Stiffness
- Clicking or catching

### Treatment Approach

**Assessment**
Thorough evaluation of posture, movement, strength

**Manual Therapy**
Joint mobilization, soft tissue release

**Exercise Prescription**
Range of motion, rotator cuff strengthening

### Recovery Expectations

- Tendinitis/Bursitis: 4-6 weeks
- Rotator Cuff Strain: 6-8 weeks
- Frozen Shoulder: 6-12 months

### Prevention

- Maintain good posture
- Strengthen rotator cuff regularly
- Warm up before activities
- Take breaks during repetitive tasks""",
            "faqs": [
                {
                    "question": "How long does frozen shoulder last?",
                    "answer": "Without treatment: 1-3 years. With physiotherapy: often 6-12 months. Early treatment leads to better outcomes."
                },
                {
                    "question": "When is shoulder surgery necessary?",
                    "answer": "When conservative treatment fails after 3-6 months, or for complete rotator cuff tears in active individuals."
                }
            ]
        }
    ]
    
    for article_data in articles:
        article = BlogArticle(
            title=article_data["title"],
            slug=article_data["slug"],
            excerpt=article_data["excerpt"],
            content=article_data["content"],
            category=article_data["category"],
            author=article_data["author"],
            author_role=article_data["author_role"],
            read_time=article_data["read_time"],
            image=article_data["image"],
            tags=json.dumps(article_data["tags"]),
            faqs=json.dumps(article_data["faqs"]),
            is_featured=article_data["is_featured"],
            is_published=True
        )
        db.add(article)
    
    db.commit()
    print(f"Successfully seeded {len(articles)} blog articles!")
    db.close()


if __name__ == "__main__":
    seed_blog_articles()
