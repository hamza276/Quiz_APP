import streamlit as st
import time
from streamlit_autorefresh import st_autorefresh

# Auto-refresh the app every second to update the timer.
st_autorefresh(interval=1000, key="quiz_autorefresh")

# Quiz data
quiz_data = [
    {
        "question": "What is the purpose of Supplementary Certificates in relation to the Permit to Work?",
        "options": [
            {"text": "They authorize the work", "correct": False},
            {"text": "They provide additional information for safe work practices", "correct": True},
            {"text": "They replace the need for a Permit to Work", "correct": False},
            {"text": "They serve as isolation points for the worksite", "correct": False}
        ],
        "explanation": "Supplementary Certificates provide additional information for safe work practices."
    },
    {
        "question": "What is the minimum time during a shift handover of permit?",
        "options": [
            {"text": "120 minutes", "correct": False},
            {"text": "60 minutes", "correct": True},
            {"text": "30 minutes", "correct": False},
            {"text": "None of above", "correct": False}
        ],
        "explanation": "The minimum time during a shift handover of permit is 60 minutes."
    },
    {
        "question": "What is meant by the grey dot in this flow diagram?",
        "options": [
            {"text": "Awaiting for Acceptance", "correct": False},
            {"text": "Initiated", "correct": False},
            {"text": "Not started", "correct": True},
            {"text": "None of the above", "correct": False}
        ],
        "explanation": "The grey dot in the flow diagram means that the task is not started."
    },
    {
        "question": "Why is there no 'revert to PAP' workflow action at this point?",
        "options": [
            {"text": "There is no 'revert to PAP' status because the PAP can still edit the permit at this point", "correct": True},
            {"text": "Because Permit is Live", "correct": False},
            {"text": "Need Approval From PA", "correct": False},
            {"text": "None", "correct": False}
        ],
        "explanation": "There is no 'revert to PAP' status because the PAP can still edit the permit at this point."
    },
    {
        "question": "How many Permits or Certificates are in 'Live' status?",
        "options": [
            {"text": "One", "correct": False},
            {"text": "Two", "correct": False},
            {"text": "Three", "correct": False},
            {"text": "None", "correct": True}
        ],
        "explanation": "There are no Permits or Certificates in 'Live' status."
    },
    {
        "question": "Refer to the screenshot, how do you obtain a list of company and persons able to sign the next action?",
        "options": [
            {"text": "Click on the Head/ Shoulders icon next to the action", "correct": True},
            {"text": "Check In Main Menu", "correct": False},
            {"text": "PC Will Inform", "correct": False},
            {"text": "By sending request to PA", "correct": False}
        ],
        "explanation": "You obtain a list of company and persons able to sign the next action by clicking on the Head/ Shoulders icon next to the action."
    }
]

# Quiz duration in seconds (10 minutes)
QUIZ_DURATION = 600

# Initialize session state variables
if "current_question_index" not in st.session_state:
    st.session_state.current_question_index = None
if "score" not in st.session_state:
    st.session_state.score = 0
if "selected_option" not in st.session_state:
    st.session_state.selected_option = None
if "show_explanation" not in st.session_state:
    st.session_state.show_explanation = False
if "time_up" not in st.session_state:
    st.session_state.time_up = False
if "start_time" not in st.session_state:
    st.session_state.start_time = None

# Function to calculate remaining time
def get_remaining_time():
    if st.session_state.start_time is None:
        return QUIZ_DURATION
    elapsed = time.time() - st.session_state.start_time
    remaining = QUIZ_DURATION - elapsed
    return int(remaining) if remaining > 0 else 0

remaining_time = get_remaining_time()
minutes = remaining_time // 60
seconds = remaining_time % 60

# If time has run out and the quiz has started, mark it as time up.
if remaining_time <= 0 and st.session_state.current_question_index is not None:
    st.session_state.time_up = True

# Function to restart the quiz
def restart_quiz():
    st.session_state.current_question_index = None
    st.session_state.score = 0
    st.session_state.selected_option = None
    st.session_state.show_explanation = False
    st.session_state.time_up = False
    st.session_state.start_time = None
    st.experimental_rerun()

# Function to start the quiz
def start_quiz():
    st.session_state.current_question_index = 0
    st.session_state.start_time = time.time()
    st.experimental_rerun()

# Function to submit an answer
def submit_answer():
    idx = st.session_state.current_question_index
    selected = st.session_state.selected_option
    if selected is not None:
        question = quiz_data[idx]
        if question["options"][selected]["correct"]:
            st.session_state.score += 1
        st.session_state.show_explanation = True
        st.experimental_rerun()

# Function to move to the next question
def next_question():
    st.session_state.current_question_index += 1
    st.session_state.selected_option = None
    st.session_state.show_explanation = False
    st.experimental_rerun()

st.title("Quiz App")

# If time is up, show final score and option to restart.
if st.session_state.time_up:
    st.subheader("Time's up! Quiz Completed")
    st.write(f"You scored {st.session_state.score} out of {len(quiz_data)}.")
    if st.button("Restart Quiz"):
        restart_quiz()
    st.stop()

# If quiz hasn't started, show welcome screen.
if st.session_state.current_question_index is None:
    st.subheader("Welcome to the Quiz")
    st.write("You have 10 minutes to complete the quiz.")
    if st.button("Start Quiz"):
        start_quiz()
    st.stop()

# Display the timer
st.markdown(f"### Time Remaining: {minutes}:{seconds:02d}")

# If all questions have been answered, show final score.
if st.session_state.current_question_index >= len(quiz_data):
    st.subheader("Quiz Completed")
    st.write(f"You scored {st.session_state.score} out of {len(quiz_data)}.")
    if st.button("Restart Quiz"):
        restart_quiz()
    st.stop()

# Display current question
current_question = quiz_data[st.session_state.current_question_index]
st.markdown(f"#### Question {st.session_state.current_question_index + 1}: {current_question['question']}")

# List the answer options as buttons.
for i, option in enumerate(current_question["options"]):
    # Disable the buttons if the answer has been submitted.
    if st.session_state.show_explanation:
        disabled = True
    else:
        disabled = False
    if st.button(option["text"], key=f"option_{i}", disabled=disabled):
        st.session_state.selected_option = i
        st.experimental_rerun()

# If an option is selected and the answer hasn’t been submitted, show a "Submit Answer" button.
if st.session_state.selected_option is not None and not st.session_state.show_explanation:
    if st.button("Submit Answer"):
        submit_answer()

# If answer has been submitted, display whether it was correct along with the explanation.
if st.session_state.show_explanation:
    selected = st.session_state.selected_option
    if selected is not None:
        if current_question["options"][selected]["correct"]:
            st.success("Correct!")
        else:
            st.error("Wrong!")
        st.info(current_question["explanation"])
    if st.button("Next"):
        next_question()
