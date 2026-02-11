import re
import itertools
from collections import defaultdict

# ============================================================
# Synthetic users + messages (same as before)
# ============================================================

USERS = [
    {"user_id": "u1",  "timezone": "Asia/Singapore", "languages": ["en"], "interests": ["anime", "games"],  "opts": {"stretch_mode": False}},
    {"user_id": "u2",  "timezone": "Asia/Singapore", "languages": ["en"], "interests": ["anime", "music"],  "opts": {"stretch_mode": False}},
    {"user_id": "u3",  "timezone": "Asia/Singapore", "languages": ["en"], "interests": ["games", "anime"],  "opts": {"stretch_mode": False}},
    {"user_id": "u4",  "timezone": "Asia/Singapore", "languages": ["en"], "interests": ["sports", "fitness"],"opts": {"stretch_mode": False}},
    {"user_id": "u5",  "timezone": "Asia/Singapore", "languages": ["en"], "interests": ["music", "art"],    "opts": {"stretch_mode": False}},
    {"user_id": "u6",  "timezone": "Asia/Singapore", "languages": ["en"], "interests": ["music", "anime"],  "opts": {"stretch_mode": False}},
    {"user_id": "u7",  "timezone": "Asia/Singapore", "languages": ["en"], "interests": ["anime", "art"],    "opts": {"stretch_mode": False}},
    {"user_id": "u8",  "timezone": "Asia/Singapore", "languages": ["en"], "interests": ["sports", "games"], "opts": {"stretch_mode": False}},
    {"user_id": "u9",  "timezone": "Asia/Singapore", "languages": ["en"], "interests": ["art", "music"],    "opts": {"stretch_mode": False}},
    {"user_id": "u10", "timezone": "Asia/Singapore", "languages": ["en"], "interests": ["games", "anime"],  "opts": {"stretch_mode": True}},
]

MESSAGES = []
_ts = 1

def add(uid, texts):
    global _ts
    for txt in texts:
        MESSAGES.append({"user_id": uid, "timestamp": _ts, "text": txt})
        _ts += 1

add("u1", [
    "Anime and co-op games are my thing.",
    "Any anime you recommend?",
    "Nice.",
    "Yeah same.",
    "Cool!",
    "What games do you play?",
    "Sounds fun.",
    "Ok."
])

add("u3", [
    "I play games, mostly co-op.",
    "Anime is fun too.",
    "Nice.",
    "Ok.",
    "What are you into?",
    "Same here.",
    "Cool.",
    "lol"
])

add("u2", [
    "I like anime openings and music.",
    "Sometimes I get nervous starting chats.",
    "If people ask a question, it feels easier.",
    "I overthink my first message a lot.",
    "What music do you like?",
    "I try to reply with a bit more detail.",
    "Thanks, that helps.",
    "Hope that makes sense."
])

add("u7", [
    "I like anime and drawing.",
    "I'm shy at first in new chats.",
    "I usually warm up after a few messages.",
    "If the vibe is kind, I talk more.",
    "What art style do you like?",
    "I like character designs.",
    "That's really cool to hear.",
    "Thanks for sharing."
])

add("u4", [
    "I'm into sports and fitness.",
    "Yesterday I tried a new workout and it was hard.",
    "I felt proud after finishing though.",
    "My friend said my form improved.",
    "I get anxious before matches sometimes.",
    "But training with friends helps a lot.",
    "Do you play any sports?",
    "What are your goals this month?"
])

add("u8", [
    "Sports and games are my main hobbies.",
    "Yesterday my team lost and I felt annoyed.",
    "I told my friend I needed a break.",
    "I get nervous before big games.",
    "But I calm down when I focus on breathing.",
    "Do you play anything competitive?",
    "I want to improve my mindset this season.",
    "Thanks for listening."
])

add("u5", [
    "Music and art are my comfort zone.",
    "I make playlists for different moods.",
    "I get anxious in group chats sometimes.",
    "So I read quietly first, then reply.",
    "If someone replies kindly, I open up more.",
    "What kind of art do you like?",
    "I prefer calm conversations.",
    "That was nice to talk about."
])

add("u9", [
    "I like art and I listen to music when I draw.",
    "Sometimes I worry people will judge my work.",
    "When that happens, I go quiet and keep sketching.",
    "I want to share more confidently though.",
    "What do you like creating?",
    "I like supportive chats with clear questions.",
    "Thanks, I feel a bit better.",
    "That helps a lot."
])

add("u6", [
    "I'm into music, especially indie pop and lo-fi beats for studying.",
    "Anime soundtracks are underrated, they set the mood instantly.",
    "Yesterday my friend sent me a song and I replayed it like ten times.",
    "I get excited when people trade recommendations and explain why they like a track.",
    "Sometimes I ramble when I'm passionate, so tell me if you want shorter replies.",
    "What's one song you never skip, and what do you like about it?",
    "I also like talking about how lyrics connect to real moments in life.",
    "Thanks for chatting, this topic always makes me feel more open."
])

add("u10", [
    "I'm into games and anime, and I can talk a lot when the topic clicks with me.",
    "I'm trying to meet new people without freezing up, especially in voice calls.",
    "When I'm nervous, I overexplain, then I regret it, so I'm practicing being clearer.",
    "I also want deeper conversations sometimes, not just small talk about the weather.",
    "What's something you've been obsessed with lately, and why does it matter to you?",
    "If you want, I can keep things short too—just tell me your vibe and pace.",
    "I like people who ask follow-up questions, because it feels like they care.",
    "Thanks, this kind of practice makes real conversations feel less scary."
])


# ============================================================
# Style-match system (no ML): verbosity + disclosure + scoring + pairs
# ============================================================

WINDOW_MSGS = 80
MIN_MSGS_FOR_STABILITY = 8

VERBOSITY_LOW_MAX = 6
VERBOSITY_MED_MAX = 14

W_VERB = 0.40
W_DISC = 0.30
W_STAB = 0.15
W_INTR = 0.10
W_TIME = 0.05

def tokenize(text: str):
    return re.findall(r"[A-Za-z']+", text.lower())

def clamp(x, lo=0.0, hi=1.0):
    return max(lo, min(hi, x))

def count_first_person(tokens):
    FIRST = {"i", "me", "my", "mine", "im", "i'm", "ive", "i've", "myself"}
    return sum(1 for t in tokens if t in FIRST)

def has_emotion_word(tokens):
    EMO = {"nervous", "worried", "anxious", "stressed", "scared", "excited",
           "happy", "sad", "angry", "frustrated", "shy", "annoyed", "proud"}
    return any(t in EMO for t in tokens)

def has_personal_relation(tokens):
    REL = {"mom", "dad", "mother", "father", "sister", "brother", "friend",
           "teacher", "classmate", "partner", "team"}
    if any(t in REL for t in tokens):
        return True
    for i in range(len(tokens) - 1):
        if tokens[i] == "my" and tokens[i + 1] in REL:
            return True
    return False

def has_time_hint(tokens):
    TIME = {"today", "yesterday", "tomorrow", "last", "week", "month", "year",
            "tonight", "morning", "afternoon", "season"}
    return any(t in TIME for t in tokens)

def looks_like_personal_event(text):
    t = text.lower()
    if re.search(r"\b(i|i'm|im)\b.*\b(was|were|did|went|had|got|said|told|felt|tried|lost)\b", t):
        return True
    if re.search(r"\b(i|i'm|im)\b.*\b(when|because)\b", t):
        return True
    return False

def contains_sensitive_flag(text):
    # Minimal placeholder for prototype safety routing.
    SENSITIVE = ["kill myself", "self-harm", "suicide", "abuse", "rape", "assault"]
    t = text.lower()
    return any(p in t for p in SENSITIVE)

def disclosure_tier(text):
    if contains_sensitive_flag(text):
        return "D3"
    tokens = tokenize(text)

    score = 0
    if count_first_person(tokens) >= 1: score += 1
    if has_personal_relation(tokens):   score += 1
    if has_emotion_word(tokens):        score += 1
    if looks_like_personal_event(text): score += 1
    if has_time_hint(tokens):           score += 1

    if score <= 1: return "D0"
    if score <= 3: return "D1"
    return "D2"

def tier_to_num(t):
    return {"D0": 0, "D1": 1, "D2": 2}.get(t, 0)

def num_to_tier(n):
    n = int(clamp(n, 0, 2))
    return {0: "D0", 1: "D1", 2: "D2"}[n]

def verbosity_bucket(mean_words: float):
    if mean_words <= VERBOSITY_LOW_MAX: return "LOW"
    if mean_words <= VERBOSITY_MED_MAX: return "MED"
    return "HIGH"

def timezone_band(_tz: str):
    return "SG"

def interest_overlap(A, B):
    a = set(A["interests"]); b = set(B["interests"])
    return len(a & b) / len(a | b) if (a | b) else 0.0

def time_overlap(A, B):
    return 1.0 if timezone_band(A["timezone"]) == timezone_band(B["timezone"]) else 0.0

def stability_score(verbosity_std, disclosure_variability, n_msgs):
    if n_msgs < MIN_MSGS_FOR_STABILITY:
        return 0.0
    v_stab = clamp(1 - (verbosity_std / 10.0), 0, 1)
    d_stab = clamp(1 - disclosure_variability, 0, 1)
    return 0.6 * v_stab + 0.4 * d_stab

def build_style_vectors(messages, users):
    messages_by_user = defaultdict(list)
    for m in messages:
        messages_by_user[m["user_id"]].append(m)
    for uid in messages_by_user:
        messages_by_user[uid].sort(key=lambda x: x["timestamp"], reverse=True)

    style = {}
    for u in users:
        uid = u["user_id"]
        recent = messages_by_user.get(uid, [])[:WINDOW_MSGS]
        if not recent:
            style[uid] = {"eligible": False, "reason": "no_messages"}
            continue

        word_counts = [len(tokenize(m["text"])) for m in recent]
        mean_words = sum(word_counts) / len(word_counts)
        mu = mean_words
        var = sum((x - mu) ** 2 for x in word_counts) / len(word_counts)
        std = var ** 0.5

        tiers = [disclosure_tier(m["text"]) for m in recent]
        if any(t == "D3" for t in tiers):
            style[uid] = {"eligible": False, "reason": "sensitive"}
            continue

        # Representative disclosure depth = 80th percentile (not mode)
        nums = sorted(tier_to_num(t) for t in tiers)
        p80 = nums[int(0.8 * (len(nums) - 1))]
        rep = num_to_tier(p80)
        variability = 1 - (nums.count(p80) / len(nums))

        stab = stability_score(std, variability, len(recent))

        style[uid] = {
            "eligible": True,
            "user_id": uid,
            "verbosity_mean": mean_words,
            "verbosity_bucket": verbosity_bucket(mean_words),
            "disclosure_rep": rep,
            "disclosure_var": variability,
            "stability": stab,
            "languages": u["languages"],
            "timezone": u["timezone"],
            "interests": u["interests"],
            "stretch_mode": u["opts"]["stretch_mode"],
        }
    return style

def compatible_disclosure(A, B):
    dist = abs(tier_to_num(A["disclosure_rep"]) - tier_to_num(B["disclosure_rep"]))
    if dist == 2:
        return A["stretch_mode"] and B["stretch_mode"]
    return True

def score_pair(A, B):
    if not compatible_disclosure(A, B):
        return float("-inf")

    dv = abs(A["verbosity_mean"] - B["verbosity_mean"])
    dv_norm = clamp(dv / 20.0, 0, 1)

    dd = abs(tier_to_num(A["disclosure_rep"]) - tier_to_num(B["disclosure_rep"]))  # 0..2

    s = 0.0
    s += W_VERB * (1 - dv_norm)
    s += W_DISC * (1 - (dd / 2.0))
    s += W_STAB * min(A["stability"], B["stability"])
    s += W_INTR * interest_overlap(A, B)
    s += W_TIME * time_overlap(A, B)
    return s

def match_pairs(style, top_k=3):
    eligible = [uid for uid, sv in style.items() if sv.get("eligible")]

    score_map = {}
    for a, b in itertools.combinations(eligible, 2):
        s = score_pair(style[a], style[b])
        if s != float("-inf"):
            score_map[(a, b)] = s
            score_map[(b, a)] = s

    # top-k per user
    top = {}
    for a in eligible:
        candidates = [(score_map[(a, b)], b) for b in eligible if b != a and (a, b) in score_map]
        candidates.sort(key=lambda x: (-x[0], x[1]))
        top[a] = [b for _, b in candidates[:top_k]]

    # mutual edges
    edges = []
    for a, b in itertools.combinations(eligible, 2):
        if (a, b) not in score_map:
            continue
        if (b in top[a]) and (a in top[b]):
            lo, hi = sorted([a, b], key=lambda x: int(x[1:]))
            edges.append((score_map[(a, b)], lo, hi))

    # greedy non-overlapping pairs (deterministic)
    edges.sort(key=lambda x: (-x[0], int(x[1][1:]), int(x[2][1:])))
    matched = set()
    pairs = []
    for s, a, b in edges:
        if a in matched or b in matched:
            continue
        pairs.append((a, b, round(s, 3)))
        matched.add(a); matched.add(b)

    unmatched = [u for u in eligible if u not in matched]
    return pairs, unmatched


# ============================================================
# Step 3: Messaging Interface (Icebreakers + shared interests + fade out)
# ============================================================

def shared_interests(userA, userB):
    return sorted(list(set(userA["interests"]) & set(userB["interests"])))

def format_shared_interests(shared):
    if not shared:
        return "No obvious shared interests yet — start with a light question."
    return ", ".join(shared)

def suggest_icebreakers(userA, userB, styleA, styleB):
    """
    Reduce friction:
    - highlight shared interests
    - offer 3 starters tuned to verbosity + disclosure depth
    No ML: just templates.
    """
    shared = shared_interests(userA, userB)

    # Choose a "tone" based on disclosure depth
    d = max(tier_to_num(styleA["disclosure_rep"]), tier_to_num(styleB["disclosure_rep"]))
    # Choose brevity based on lower-verbosity partner
    short_mode = (styleA["verbosity_bucket"] == "LOW") or (styleB["verbosity_bucket"] == "LOW")

    starters = []

    if shared:
        topic = shared[0]
        if topic == "anime":
            starters.append("You both like anime — what’s one show you’d recommend to a friend and why?")
            starters.append("Quick one: sub or dub? (No judging 😄)")
            starters.append("What anime opening never gets old for you?")
        elif topic == "games":
            starters.append("You both like games — co-op or solo lately?")
            starters.append("What’s a game you wish you could play again for the first time?")
            starters.append("What’s your comfort game when you just want to chill?")
        elif topic == "music":
            starters.append("You both like music — what’s one song you never skip?")
            starters.append("What do you usually listen to when you’re studying or commuting?")
            starters.append("If you could recommend one artist, who would it be?")
        elif topic == "art":
            starters.append("You both like art — what do you like creating or looking at most?")
            starters.append("What’s your go-to art style or vibe (cute, realistic, messy, clean)?")
            starters.append("Any artists (online or IRL) who inspire you?")
        elif topic == "sports":
            starters.append("You both like sports — do you prefer playing or watching more?")
            starters.append("What’s the most satisfying part of a good game for you?")
            starters.append("Any sport you want to try this year?")
        else:
            starters.append(f"You both like {topic} — what got you into it?")
            starters.append(f"What’s one thing you enjoy most about {topic}?")
            starters.append(f"Got any {topic} recommendations?")

    else:
        starters.append("Want an easy start? What’s your go-to hobby when you need to recharge?")
        starters.append("What’s something small that made your day better recently?")
        starters.append("If you could instantly get good at one skill, what would it be?")

    # If disclosure depth supports it, add 1 deeper-but-still-safe option (replace one template)
    if d >= 1:
        deeper = "Sometimes starting is the hardest part — what kind of conversations feel easiest for you (funny, chill, deep, random)?"
        starters[-1] = deeper

    # If short mode, shorten phrasing
    if short_mode:
        starters = [
            s.replace(" — ", ": ").replace("what’s", "what's").replace(" you’d ", " you'd ")
            for s in starters
        ]
        # Ensure at least one super-short option
        starters[1] = "Quick one: what's your current favorite?"
    return starters[:3]

def conversation_stable(chat_log):
    """
    Simple “Aura fades out” heuristic:
    - If there are at least 6 turns (3 each)
    - And the last 4 messages average >= ~6 words (not one-word replies)
    - And both users have spoken at least once in last 4 turns
    """
    if len(chat_log) < 6:
        return False

    last = chat_log[-4:]
    words = [len(tokenize(m["text"])) for m in last]
    avg_words = sum(words) / len(words)

    speakers = set(m["user_id"] for m in last)
    if avg_words >= 6 and len(speakers) >= 2:
        return True
    return False

class MessagingAssist:
    """
    Aura helper that suggests icebreakers early,
    then fades out once the conversation is stable.
    """
    def __init__(self, userA, userB, styleA, styleB):
        self.userA = userA
        self.userB = userB
        self.styleA = styleA
        self.styleB = styleB
        self.faded = False

    def get_suggestions(self, chat_log):
        if self.faded:
            return []

        if conversation_stable(chat_log):
            self.faded = True
            return ["Aura: Looks like you two are flowing — I’ll fade into the background."]

        return suggest_icebreakers(self.userA, self.userB, self.styleA, self.styleB)


# ============================================================
# Demo main: match pairs + show messaging interface preview
# ============================================================

def main():
    user_by_id = {u["user_id"]: u for u in USERS}

    style = build_style_vectors(MESSAGES, USERS)
    pairs, unmatched = match_pairs(style, top_k=3)

    print("\n--- STYLE VECTORS ---")
    for u in USERS:
        uid = u["user_id"]
        sv = style[uid]
        if not sv.get("eligible"):
            print(uid, "INELIGIBLE:", sv.get("reason"))
            continue
        print(
            uid,
            f"verbosity={sv['verbosity_mean']:.2f}({sv['verbosity_bucket']})",
            f"disclosure={sv['disclosure_rep']}",
            f"stability={sv['stability']:.2f}",
            f"interests={sv['interests']}",
            f"stretch={sv['stretch_mode']}",
        )

    print("\n--- PAIRS ---")
    for i, (a, b, s) in enumerate(pairs, start=1):
        print(f"Pair {i}: {a} <-> {b}  score={s}")

    print("\n--- UNMATCHED ---")
    print(unmatched)

    # ===== Messaging interface preview for each pair =====
    print("\n--- MESSAGING INTERFACE PREVIEW ---")
    for (a, b, s) in pairs:
        ua, ub = user_by_id[a], user_by_id[b]
        sa, sb = style[a], style[b]

        shared = shared_interests(ua, ub)
        print(f"\nChat: {a} + {b} (match_score={s})")
        print(f"Shared interests: {format_shared_interests(shared)}")

        aura = MessagingAssist(ua, ub, sa, sb)

        # Simulate first screen (no messages yet)
        empty_log = []
        print("Aura suggestions (start):")
        for tip in aura.get_suggestions(empty_log):
            print(" -", tip)

        # Simulate a short conversation to show fade-out behavior
        chat_log = [
            {"user_id": a, "text": "Hey!"},
            {"user_id": b, "text": "Hi, how's it going?"},
            {"user_id": a, "text": "Pretty good. Been busy with school lately."},
            {"user_id": b, "text": "Same here. What do you usually do to stay focused?"},
            {"user_id": a, "text": "I put on music and try to do work in short bursts."},
            {"user_id": b, "text": "That makes sense. Any playlists you recommend?"},
        ]

        print("Aura suggestions (after 6 turns):")
        for tip in aura.get_suggestions(chat_log):
            print(" -", tip)

    # sanity check: no user matched twice
    flat = [x for p in pairs for x in p[:2]]
    assert len(set(flat)) == len(flat), "A user got matched twice."
    print("\n✅ Done: pairs + messaging assist preview ran.")


if __name__ == "__main__":
    main()
