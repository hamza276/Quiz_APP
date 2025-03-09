import { useState, useEffect } from 'react'
import { Button } from "/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "/components/ui/card"

const quizData = [
  {
    question: "What is the purpose of Supplementary Certificates in relation to the Permit to Work?",
    options: [
      { text: "They authorize the work", correct: false },
      { text: "They provide additional information for safe work practices", correct: true },
      { text: "They replace the need for a Permit to Work", correct: false },
      { text: "They serve as isolation points for the worksite", correct: false }
    ],
    explanation: "Supplementary Certificates provide additional information for safe work practices."
  },
  {
    question: "What is the minimum time during a shift handover of permit?",
    options: [
      { text: "120 minutes", correct: false },
      { text: "60 minutes", correct: true },
      { text: "30 minutes", correct: false },
      { text: "None of above", correct: false }
    ],
    explanation: "The minimum time during a shift handover of permit is 60 minutes."
  },
  {
    question: "What is meant by the grey dot in this flow diagram?",
    options: [
      { text: "Awaiting for Acceptance", correct: false },
      { text: "Initiated", correct: false },
      { text: "Not started", correct: true },
      { text: "None of the above", correct: false }
    ],
    explanation: "The grey dot in the flow diagram means that the task is not started."
  },
  {
    question: "Why is there no 'revert to PAP' workflow action at this point?",
    options: [
      { text: "There is no 'revert to PAP' status because the PAP can still edit the permit at this point", correct: true },
      { text: "Because Permit is Live", correct: false },
      { text: "Need Approval From PA", correct: false },
      { text: "None", correct: false }
    ],
    explanation: "There is no 'revert to PAP' status because the PAP can still edit the permit at this point."
  },
  {
    question: "How many Permits or Certificates are in 'Live' status?",
    options: [
      { text: "One", correct: false },
      { text: "Two", correct: false },
      { text: "Three", correct: false },
      { text: "None", correct: true }
    ],
    explanation: "There are no Permits or Certificates in 'Live' status."
  },
  {
    question: "Refer to the screenshot, how do you obtain a list of company and persons able to sign the next action?",
    options: [
      { text: "Click on the Head/ Shoulders icon next to the action", correct: true },
      { text: "Check In Main Menu", correct: false },
      { text: "PC Will Inform", correct: false },
      { text: "By sending request to PA", correct: false }
    ],
    explanation: "You obtain a list of company and persons able to sign the next action by clicking on the Head/ Shoulders icon next to the action."
  }
]

const Timer = ({ duration, onTimeUp }: { duration: number, onTimeUp: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else {
      onTimeUp()
    }
  }, [timeLeft, onTimeUp])

  return (
    <div className="text-2xl font-bold text-center mb-4">
      {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
    </div>
  )
}

export default function QuizApp() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [timeUp, setTimeUp] = useState(false)

  const handleAnswerOptionClick = (optionIndex: number) => {
    setSelectedOption(optionIndex)
  }

  const handleNextQuestion = () => {
    if (selectedOption !== null) {
      const currentQuestion = quizData[currentQuestionIndex!]
      if (currentQuestion.options[selectedOption].correct) {
        setScore(score + 1)
      }
      setShowExplanation(true)
    }
  }

  const handleNextButtonClick = () => {
    setSelectedOption(null)
    setShowExplanation(false)
    setCurrentQuestionIndex(currentQuestionIndex! + 1)
  }

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(null)
    setScore(0)
    setSelectedOption(null)
    setShowExplanation(false)
    setTimeUp(false)
  }

  const handleStartQuiz = () => {
    setCurrentQuestionIndex(0)
  }

  const handleTimeUp = () => {
    setTimeUp(true)
  }

  if (timeUp) {
    return (
      <Card className="w-full max-w-md mx-auto mt-10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Quiz Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">Time's up! You scored {score} out of {quizData.length}.</p>
          <Button onClick={handleRestartQuiz} variant="secondary">Restart Quiz</Button>
        </CardContent>
      </Card>
    )
  }

  if (currentQuestionIndex === null) {
    return (
      <Card className="w-full max-w-md mx-auto mt-10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Welcome to the Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">You have 10 minutes to complete the quiz.</p>
          <Button onClick={handleStartQuiz} variant="secondary">Start Quiz</Button>
        </CardContent>
      </Card>
    )
  }

  const currentQuestion = quizData[currentQuestionIndex]

  if (currentQuestionIndex >= quizData.length) {
    return (
      <Card className="w-full max-w-md mx-auto mt-10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Quiz Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">You scored {score} out of {quizData.length}.</p>
          <Button onClick={handleRestartQuiz} variant="secondary">Restart Quiz</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Question {currentQuestionIndex + 1}</CardTitle>
      </CardHeader>
      <CardContent>
        <Timer duration={600} onTimeUp={handleTimeUp} />
        <p className="text-lg mb-4">{currentQuestion.question}</p>
        {currentQuestion.options.map((option, index) => (
          <Button
            key={index}
            onClick={() => handleAnswerOptionClick(index)}
            className={`w-full mb-2 ${selectedOption === index ? 'bg-blue-500' : ''}`}
            disabled={showExplanation}
          >
            {option.text}
          </Button>
        ))}
        {showExplanation && (
          <div className="mt-4">
            <p className="text-lg mb-2">
              {currentQuestion.options[selectedOption!].correct ? "Correct!" : "Wrong!"}
            </p>
            <p className="text-lg mb-4">{currentQuestion.explanation}</p>
            <Button onClick={handleNextButtonClick} variant="secondary">
              {currentQuestionIndex === quizData.length - 1 ? "Finish" : "Next"}
            </Button>
          </div>
        )}
        {!showExplanation && selectedOption !== null && (
          <Button onClick={handleNextQuestion} variant="secondary" className="mt-4">
            Submit
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
