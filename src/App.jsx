import { useState, useEffect } from "react";
import "./App.css";

import PropTypes from "prop-types";

const Flashcard = ({
  question,
  answers,
  addAnswer,
  deleteAnswer,
  deleteQuestion,
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [newAnswer, setNewAnswer] = useState("");

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };
  const handleAddAnswer = () => {
    addAnswer(newAnswer);
    setNewAnswer("");
  };

  return (
    <div className="flashcard">
      <div className="flex flex-row justify-between p-2" onClick={toggleAnswer}>
        <div className="question">{question}</div>
        <button
          className="h-8 items-center w-4 text-blue-400 flex justify-center"
          onClick={deleteQuestion}
        >
          x
        </button>
      </div>
      {showAnswer && (
        <div className="flex  flex-col items-center gap-10">
          {/* <div className="top-20 justify-center items-center">{answer}</div> */}
          {answers.map((answer, index) => (
            <pre
              key={index}
              className="flex  h-full justify-between w-full p-3"
            >
              {answer}
              <button
                onClick={() => deleteAnswer(index)}
                className="h-8 items-center flex w-4 justify-center text-red-500"
              >
                x
              </button>
            </pre>
          ))}
          <textarea
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Add new answer"
            // className="w-full h-20"
            className="w-full h-20 bg-black p-2 rounded-lg"
          />
          <button onClick={handleAddAnswer} className="w-52 h-12">
            Add Answer
          </button>
        </div>
      )}
    </div>
  );
};

Flashcard.propTypes = {
  question: PropTypes.string.isRequired,
  answers: PropTypes.arrayOf(PropTypes.string).isRequired,
  addAnswer: PropTypes.func.isRequired,
  deleteAnswer: PropTypes.func.isRequired,
  deleteQuestion: PropTypes.func.isRequired,
};

const App = () => {
  // const [flashcards, setFlashcards] = useState([
  //   { question: "Question 1", answers: ["Answer 1"] },
  //   { question: "Question 2", answers: ["Answer 2"] },
  //   { question: "Question 3", answers: ["Answer 3"] },
  // ]);

  const [flashcards, setFlashcards] = useState([]);
  console.log("flashcards: ", flashcards);

  const [newQuestion, setNewQuestion] = useState("");
  const [showAddQuestion, setShowAddQuestion] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/flashcards")
      .then((response) => response.json())
      .then((data) => {
        // console.log("data: ", data);
        return setFlashcards(data);
      })
      .catch((error) => console.error("errores", error));
  }, []);

  const addAnswer = (index, newAnswer, id) => {
    fetch(`http://localhost:3001/flashcards/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answers: [...flashcards[index].answers, newAnswer],
      }),
    });
    const newFlashcards = [...flashcards];
    newFlashcards[index].answers.push(newAnswer);
    setFlashcards(newFlashcards);
  };

  // const deleteAnswer = (id) => {
  //   console.log("id: ", id);
  //   fetch(`http://localhost:3001/flashcards/${id}`, {
  //     method: "DELETE",
  //   })
  //     .then(() => {
  //       const updatedFlashcards = flashcards.filter(
  //         (flashcard) => flashcard.id !== id
  //       );
  //       setFlashcards(updatedFlashcards);
  //     })
  //     .catch((error) => console.error(error));
  // };

  const deleteAnswer = (flashcardIndex, answerIndex, id) => {
    fetch(`http://localhost:3001/flashcards/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answers: flashcards[flashcardIndex].answers.filter(
          (_, idx) => idx !== answerIndex
        ),
      }),
    });
    const newFlashcards = flashcards.map((flashcard, index) => {
      if (index === flashcardIndex) {
        return {
          ...flashcard,
          answers: flashcard.answers.filter((_, idx) => idx !== answerIndex),
        };
      }
      return flashcard;
    });
    setFlashcards(newFlashcards);
  };

  // const addQuestion = () => {
  //   if (newQuestion.trim() !== "") {
  //     setFlashcards([...flashcards, { question: newQuestion, answers: [] }]);
  //     setNewQuestion("");
  //   }
  //   setShowAddQuestion(!showAddQuestion);
  // };

  const addQuestion = () => {
    if (newQuestion.trim() !== "") {
      fetch("http://localhost:3001/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: newQuestion, answers: [] }),
      })
        .then((response) => response.json())
        .then((data) => {
          setFlashcards([...flashcards, data]);
          setNewQuestion("");
        })
        .catch((error) => console.error(error));
    }
    setShowAddQuestion(!showAddQuestion);
  };

  // const deleteQuestion = (index) => {
  //   const newFlashcards = [...flashcards];
  //   newFlashcards.splice(index, 1);
  //   setFlashcards(newFlashcards);
  // };

  const deleteQuestion = (id) => {
    console.log("id: ", id);
    fetch(`http://localhost:3001/flashcards/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        const updatedFlashcards = flashcards.filter(
          (flashcard) => flashcard.id !== id
        );
        setFlashcards(updatedFlashcards);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className=" h-full p-8">
      {flashcards
        .sort((a, b) => a.id - b.id)
        .map((flashcard, index) => (
          <Flashcard
            key={index}
            question={flashcard.question}
            answers={flashcard.answers}
            addAnswer={(newAnswer) => addAnswer(index, newAnswer, flashcard.id)}
            deleteAnswer={(answerIndex) =>
              deleteAnswer(index, answerIndex, flashcard.id)
            }
            onClick={() => setShowAddQuestion(!showAddQuestion)}
            deleteQuestion={() => deleteQuestion(flashcard.id)}
          />
        ))}
      <div className="flex flex-col p-4 gap-4">
        {showAddQuestion && (
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Enter new question"
            className="w-full h-20 bg-black p-2 rounded-lg"
          />
        )}
        <button onClick={addQuestion}>Add Question</button>
      </div>
    </div>
  );
};

export default App;
