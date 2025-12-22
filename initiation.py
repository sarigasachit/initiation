import streamlit as st
import json
import hashlib
import datetime
from pathlib import Path

# Configuration
PROGRESS_FILE = Path("progress.json")
HOST_PIN_HASH = hashlib.sha256("7734".encode()).hexdigest()  # Default: 7734 (change this)

# Gate definitions
GATES = {
    1: {
        "title": "GATE I",
        "type": "self_reference",
        "answer": "LET"
    },
    2: {
        "title": "GATE II", 
        "type": "coordination",
        "answer": "US"
    },
    3: {
        "title": "GATE III",
        "type": "stoic_sieve",
        "answer": "JUDGE"
    },
    4: {
        "title": "GATE IV",
        "type": "linguistic_invariant",
        "answer": "KEBAB"
    },
    5: {
        "title": "GATE V",
        "type": "jigsaw",
        "answer": None  # Jigsaw has positional solution
    },
    6: {
        "title": "GATE VI",
        "type": "relational_place",
        "answer": "WHERE"
    },
    7: {
        "title": "GATE VII",
        "type": "perception",
        "answer": "FIRE"
    },
    8: {
        "title": "GATE VIII",
        "type": "epistemology",
        "answer": "LEARNED"
    },
    9: {
        "title": "GATE IX",
        "type": "constraint_satisfaction",
        "answer": "PATIENCE"
    }
}

def init_progress():
    """Initialize or load progress"""
    if PROGRESS_FILE.exists():
        with open(PROGRESS_FILE, 'r') as f:
            return json.load(f)
    else:
        progress = {
            "current_gate": 1,
            "completed_gates": [],
            "attempts": {},
            "awaiting_host": False,
            "game_complete": False,
            "timestamps": {}
        }
        save_progress(progress)
        return progress

def save_progress(progress):
    """Save progress to file"""
    with open(PROGRESS_FILE, 'w') as f:
        json.dump(progress, f, indent=2)

def check_host_pin(pin):
    """Verify host PIN"""
    return hashlib.sha256(pin.encode()).hexdigest() == HOST_PIN_HASH

def log_attempt(gate, attempt, correct):
    """Log puzzle attempts"""
    progress = st.session_state.progress
    gate_key = f"gate_{gate}"
    if gate_key not in progress["attempts"]:
        progress["attempts"][gate_key] = []
    progress["attempts"][gate_key].append({
        "attempt": attempt,
        "correct": correct,
        "timestamp": datetime.datetime.now().isoformat()
    })
    save_progress(progress)

# ============================================================================
# GATE RENDERERS
# ============================================================================

def render_gate_1():
    """Gate I: Self-Reference - LET"""
    st.markdown("### GATE I")
    st.markdown("---")
    
    st.markdown("""
This gate opens when you speak the word that grants passage.

The word permits.  
The word allows.  
The word is the answer to its own constraint.

What single word grants permission to continue?
""")
    
    answer = st.text_input("Enter the word:", key="gate1_input").strip().upper()
    
    if st.button("Submit", key="gate1_submit"):
        if answer == GATES[1]["answer"]:
            st.success("Necessary.")
            log_attempt(1, answer, True)
            st.session_state.progress["awaiting_host"] = True
            st.session_state.progress["completed_gates"].append(1)
            save_progress(st.session_state.progress)
            st.rerun()
        else:
            log_attempt(1, answer, False)
            st.error("Not sufficient.")

def render_gate_2():
    """Gate II: Coordination - US"""
    st.markdown("### GATE II")
    st.markdown("---")
    
    st.markdown("""
Two minds.  
One answer.  
No communication required.

You and the host exist in relation.  
What word describes this relation?

Not "I".  
Not "you".  
What remains?
""")
    
    answer = st.text_input("Enter the word:", key="gate2_input").strip().upper()
    
    if st.button("Submit", key="gate2_submit"):
        if answer == GATES[2]["answer"]:
            st.success("Together.")
            log_attempt(2, answer, True)
            st.session_state.progress["awaiting_host"] = True
            st.session_state.progress["completed_gates"].append(2)
            save_progress(st.session_state.progress)
            st.rerun()
        else:
            log_attempt(2, answer, False)
            st.error("Separated.")

def render_gate_3():
    """Gate III: Stoic Sieve - JUDGE"""
    st.markdown("### GATE III")
    st.markdown("---")
    
    st.markdown("""
Consider what lies within your control:

- The weather tomorrow
- Your reputation among strangers  
- The outcome of chance
- Your interpretation of events
- The actions of others
- Your physical appearance
- Your chosen response
- The passage of time
- Your evaluation of worth

Remove all that is external.  
Remove all that fortune dictates.  
Remove all that others determine.

What single action remains absolutely within your power?
""")
    
    answer = st.text_input("Enter the word:", key="gate3_input").strip().upper()
    
    if st.button("Submit", key="gate3_submit"):
        if answer == GATES[3]["answer"]:
            st.success("Within.")
            log_attempt(3, answer, True)
            st.session_state.progress["awaiting_host"] = True
            st.session_state.progress["completed_gates"].append(3)
            save_progress(st.session_state.progress)
            st.rerun()
        else:
            log_attempt(3, answer, False)
            st.error("External.")

def render_gate_4():
    """Gate IV: Linguistic Invariant - KEBAB"""
    st.markdown("### GATE IV")
    st.markdown("---")
    
    st.markdown("""
Languages transform meaning across borders.

"Water" becomes "Wasser" becomes "eau" becomes "agua".  
"Friend" becomes "Freund" becomes "ami" becomes "amigo".  
"Love" becomes "Liebe" becomes "amour" becomes "amor".

Yet some words resist transformation.  
They pass unchanged through linguistic boundaries.  
They preserve their form across continents.

Consider a word that names:  
- Meat on a skewer  
- Cooked over sustained heat  
- Found from Berlin to Bangkok  
- Spelled identically in a dozen tongues

What is this invariant word?
""")
    
    answer = st.text_input("Enter the word:", key="gate4_input").strip().upper()
    
    if st.button("Submit", key="gate4_submit"):
        if answer == GATES[4]["answer"]:
            st.success("Universal.")
            log_attempt(4, answer, True)
            st.session_state.progress["awaiting_host"] = True
            st.session_state.progress["completed_gates"].append(4)
            save_progress(st.session_state.progress)
            st.rerun()
        else:
            log_attempt(4, answer, False)
            st.error("Mutable.")

def render_gate_5():
    """Gate V: Jigsaw - Abstract Conceptual Puzzle"""
    st.markdown("### GATE V")
    st.markdown("---")
    
    st.markdown("""
Nine fragments.  
One structure.  
No imagery.

Arrange the tiles to reveal coherent meaning.  
The structure precedes the word.
""")
    
    # Jigsaw tile definitions (3x3 grid)
    # When correctly arranged, reveals:
    # CAU | SE → | PRO
    # CES | S → | RES
    # ULT | (arr) | (arr)
    # Reading: CAUSE → PROCESS → RESULT
    #          |        |         |
    #       CULTURE  REPETITION  FIRE
    
    CORRECT_ARRANGEMENT = [
        ["FIRE", "→", "REPE"],
        ["", "↓", "TITI"],
        ["CULT", "→", "ON"],
        ["URE", "", "→"],
        ["", "", "RESU"],
        ["", "", "LT"]
    ]
    
    # Simplified: 3x3 grid with correct positions
    tiles = [
        "FI|RE", "RE|PE", "TI|TI",
        "ON", "CUL|T", "URE",
        "→ RE|SU", "LT", "↓"
    ]
    
    st.markdown("**Available tiles (drag to arrange):**")
    st.info("This is a conceptual representation. Use the dropdown selectors below to arrange tiles.")
    
    # Simplified interface: 9 position selectors
    positions = []
    cols = st.columns(3)
    for i in range(9):
        with cols[i % 3]:
            pos = st.selectbox(
                f"Position {i+1}",
                [""] + tiles,
                key=f"jigsaw_pos_{i}"
            )
            positions.append(pos)
    
    if st.button("Submit Arrangement", key="gate5_submit"):
        # Check if arrangement creates coherent structure
        # Correct arrangement (one possible solution):
        correct = [
            "FI|RE", "→ RE|SU", "LT",
            "↓", "RE|PE", "TI|TI",
            "CUL|T", "URE", "ON"
        ]
        
        # Alternative: check if FIRE, REPETITION, CULTURE, RESULT are formed
        arrangement_str = "".join(positions)
        key_elements = ["FIRE", "REPE", "TITI", "CULT", "URE", "RESU", "LT"]
        
        if all(elem.replace("|", "") in arrangement_str.replace("|", "").replace("→", "").replace("↓", "") for elem in ["FIRE", "CULT", "URE", "REPE", "TITI", "ON", "RESU", "LT"]):
            st.success("Structure precedes location.")
            log_attempt(5, str(positions), True)
            st.session_state.progress["awaiting_host"] = True
            st.session_state.progress["completed_gates"].append(5)
            save_progress(st.session_state.progress)
            st.rerun()
        else:
            log_attempt(5, str(positions), False)
            st.error("Fragmented.")

def render_gate_6():
    """Gate VI: Relational Place - WHERE"""
    st.markdown("### GATE VI")
    st.markdown("---")
    
    st.markdown("""
Location is not coordinates.  
Place is not a point on a map.

Fire transforms through repetition.  
Repetition creates culture.  
Culture resides in place.

The question precedes the answer.  
The inquiry precedes the destination.

What single word asks for location without demanding latitude?  
What word seeks place through relation rather than position?
""")
    
    answer = st.text_input("Enter the word:", key="gate6_input").strip().upper()
    
    if st.button("Submit", key="gate6_submit"):
        if answer == GATES[6]["answer"]:
            st.success("Located.")
            log_attempt(6, answer, True)
            st.session_state.progress["awaiting_host"] = True
            st.session_state.progress["completed_gates"].append(6)
            save_progress(st.session_state.progress)
            st.rerun()
        else:
            log_attempt(6, answer, False)
            st.error("Displaced.")

def render_gate_7():
    """Gate VII: Perception - FIRE"""
    st.markdown("### GATE VII")
    st.markdown("---")
    
    st.markdown("""
Look beyond the surface.  
Some truths hide in plain sight.

    ╔═══════════════════════════╗
    ║ F ░ I ░ R ░ E ░ ░ ░ ░ ░ ░ ║
    ║ ░ L ░ A ░ M ░ E ░ ░ ░ ░ ░ ║
    ║ ░ ░ H ░ E ░ A ░ T ░ ░ ░ ░ ║
    ║ ░ ░ ░ B ░ U ░ R ░ N ░ ░ ░ ║
    ║ ░ ░ ░ ░ I ░ G ░ N ░ I ░ T ║
    ║ ░ ░ ░ ░ ░ L ░ O ░ W ░ ░ ░ ║
    ╚═══════════════════════════╝

Read the diagonal.  
Not the noise.  
What element appears?
""")
    
    answer = st.text_input("Enter the word:", key="gate7_input").strip().upper()
    
    if st.button("Submit", key="gate7_submit"):
        if answer == GATES[7]["answer"]:
            st.success("Illuminated.")
            log_attempt(7, answer, True)
            st.session_state.progress["awaiting_host"] = True
            st.session_state.progress["completed_gates"].append(7)
            save_progress(st.session_state.progress)
            st.rerun()
        else:
            log_attempt(7, answer, False)
            st.error("Obscured.")

def render_gate_8():
    """Gate VIII: Epistemology - LEARNED"""
    st.markdown("### GATE VIII")
    st.markdown("---")
    
    st.markdown("""
Knowledge comes in two forms:

**KNOWN** = possessed from the start, innate, given  
**?** = acquired through experience, earned through repetition

A child knows hunger.  
A child _______ to walk.

A bird knows flight.  
A bird _______ its territory.

Fire knows heat.  
Patience is _______.

What verb describes knowledge gained only through time?  
What word means "acquired through repeated experience"?

Past tense. One word.
""")
    
    answer = st.text_input("Enter the word:", key="gate8_input").strip().upper()
    
    if st.button("Submit", key="gate8_submit"):
        if answer == GATES[8]["answer"]:
            st.success("Acquired.")
            log_attempt(8, answer, True)
            st.session_state.progress["awaiting_host"] = True
            st.session_state.progress["completed_gates"].append(8)
            save_progress(st.session_state.progress)
            st.rerun()
        else:
            log_attempt(8, answer, False)
            st.error("Innate.")

def render_gate_9():
    """Gate IX: Constraint Satisfaction - PATIENCE"""
    st.markdown("### GATE IX")
    st.markdown("---")
    
    st.markdown("""
**CONSTRAINTS:**

1. Eight letters.
2. Contains exactly three vowels.
3. First letter: P
4. Last letter: E
5. The word describes a quality required to solve this very puzzle.
6. It cannot be achieved through force.
7. It grows only through sustained practice.
8. Fire teaches it to meat.

What word satisfies all constraints?
""")
    
    answer = st.text_input("Enter the word:", key="gate9_input").strip().upper()
    
    if st.button("Submit", key="gate9_submit"):
        if answer == GATES[9]["answer"]:
            # Verify constraints
            if (len(answer) == 8 and 
                answer[0] == 'P' and 
                answer[-1] == 'E' and
                sum(1 for c in answer if c in 'AEIOU') == 3):
                
                st.success("Complete.")
                log_attempt(9, answer, True)
                st.session_state.progress["game_complete"] = True
                st.session_state.progress["completed_gates"].append(9)
                save_progress(st.session_state.progress)
                st.rerun()
            else:
                log_attempt(9, answer, False)
                st.error("Incomplete.")
        else:
            log_attempt(9, answer, False)
            st.error("Too hasty.")

# ============================================================================
# HOST APPROVAL INTERFACE
# ============================================================================

def render_awaiting_host():
    """Show 'Return to Saggu' message"""
    st.markdown("---")
    st.markdown("## Return to Saggu.")
    st.markdown("---")
    
    st.info("The gate is solved. Await approval.")

def render_host_approval():
    """Host PIN entry to unlock next gate"""
    st.sidebar.markdown("---")
    st.sidebar.markdown("### HOST CONTROL")
    
    pin = st.sidebar.text_input("Host PIN:", type="password", key="host_pin")
    
    if st.sidebar.button("Approve & Unlock Next Gate"):
        if check_host_pin(pin):
            st.session_state.progress["current_gate"] += 1
            st.session_state.progress["awaiting_host"] = False
            save_progress(st.session_state.progress)
            st.sidebar.success("Gate unlocked.")
            st.rerun()
        else:
            st.sidebar.error("Invalid PIN.")

# ============================================================================
# ADMIN PANEL
# ============================================================================

def render_admin_panel():
    """Host admin panel"""
    st.sidebar.markdown("---")
    st.sidebar.markdown("### ADMIN PANEL")
    
    pin = st.sidebar.text_input("Admin PIN:", type="password", key="admin_pin")
    
    if st.sidebar.button("Access Admin"):
        if check_host_pin(pin):
            st.session_state.show_admin = True
        else:
            st.sidebar.error("Invalid PIN.")
    
    if st.session_state.get("show_admin", False):
        st.sidebar.markdown("---")
        st.sidebar.markdown("**PROGRESS:**")
        st.sidebar.write(f"Current Gate: {st.session_state.progress['current_gate']}")
        st.sidebar.write(f"Completed: {st.session_state.progress['completed_gates']}")
        
        if st.sidebar.button("Reset Progress"):
            st.session_state.progress = {
                "current_gate": 1,
                "completed_gates": [],
                "attempts": {},
                "awaiting_host": False,
                "game_complete": False,
                "timestamps": {}
            }
            save_progress(st.session_state.progress)
            st.sidebar.success("Progress reset.")
            st.rerun()
        
        if st.sidebar.button("View Attempt Log"):
            st.sidebar.json(st.session_state.progress["attempts"])
        
        if st.sidebar.button("Show Answer Key"):
            st.sidebar.markdown("**ANSWERS:**")
            for gate_num, gate_data in GATES.items():
                st.sidebar.write(f"Gate {gate_num}: {gate_data['answer']}")

# ============================================================================
# FINAL REVEAL
# ============================================================================

def render_final_reveal():
    """Final poetic reveal"""
    st.markdown("<br><br><br>", unsafe_allow_html=True)
    
    st.markdown("""
<div style="text-align: center; font-size: 2.5em; line-height: 1.8; font-family: serif; color: #2c3e50;">
Let us judge kebab<br>
where fire learned patience.
</div>
""", unsafe_allow_html=True)
    
    st.markdown("<br><br><br>", unsafe_allow_html=True)

# ============================================================================
# MAIN APPLICATION
# ============================================================================

def main():
    st.set_page_config(page_title="Initiation", page_icon="🔥", layout="centered")
    
    # Custom CSS for minimal aesthetic
    st.markdown("""
    <style>
    .stApp {
        background-color: #f8f9fa;
    }
    h1, h2, h3 {
        font-family: 'Georgia', serif;
        color: #2c3e50;
    }
    .stTextInput > div > div > input {
        font-family: 'Courier New', monospace;
    }
    </style>
    """, unsafe_allow_html=True)
    
    # Initialize
    if "progress" not in st.session_state:
        st.session_state.progress = init_progress()
    
    # Render host approval interface in sidebar
    if st.session_state.progress["awaiting_host"]:
        render_host_approval()
    
    # Render admin panel
    render_admin_panel()
    
    # Main content
    st.title("Initiation")
    
    # Game complete - show final reveal
    if st.session_state.progress.get("game_complete", False):
        render_final_reveal()
        return
    
    # Show current gate or waiting message
    current_gate = st.session_state.progress["current_gate"]
    
    if st.session_state.progress["awaiting_host"]:
        render_awaiting_host()
    else:
        # Render current gate
        if current_gate == 1:
            render_gate_1()
        elif current_gate == 2:
            render_gate_2()
        elif current_gate == 3:
            render_gate_3()
        elif current_gate == 4:
            render_gate_4()
        elif current_gate == 5:
            render_gate_5()
        elif current_gate == 6:
            render_gate_6()
        elif current_gate == 7:
            render_gate_7()
        elif current_gate == 8:
            render_gate_8()
        elif current_gate == 9:
            render_gate_9()

if __name__ == "__main__":
    main()
