import './App.css';

import '@tensorflow/tfjs';
import { useRef, useState, useEffect } from 'react';
import * as qna from '@tensorflow-models/qna';
import { Fragment } from 'react';

function App() {
  // const qna = require('@tensorflow-models/qna');

  const input_ref = useRef(null);
  const question_ref = useRef(null);

  const [answer, set_answer] = useState();
  const [model, set_model] = useState(null);
  const [loading , set_loading] = useState();
  const load_model = async () => {
    try {
      const model = await qna.load();
      set_model(model);
    } catch (error) {
      console.log('error while loading model', error);
    }
  }
  useEffect(() => {
    load_model();
  }, []);



  // hanndle question
  const answer_question = async (e) => {
    if (e.which === 13) {
      set_loading(true);
      const passage = input_ref.current.value
      const question = question_ref.current.value


      await qna.load().then(model => {
        // Find the answers
        model.findAnswers(question, passage).then(answers => {
          console.log('Answers: ', answers);
          set_answer(answers)
          set_loading(false) ;
        });
      });
      // console.log('answer is ' , answers);
    }
  }

  return (
    <div className="App">

      <header className=" bg-blue-500 flex w-full pt-16 min-h-screen">
        <div className="container mx-auto">
          <h1 className="text-5xl text-white font-extrabold  "> Q&A From Bert  </h1>
          {model == null ?
            <div>
              <div className="text-2xl font-bold text-blue-900">Model Loading...</div>
            </div> :
            <Fragment>
              <div className="pt-4 grid">
                <p className="text-xl font-normal text-white ">Passage</p>
                <textarea ref={input_ref} className="h-48 my-2 p-4 w-full rounded-lg font-bold"></textarea>
                <p className="text-xl font-normal text-white"> Ask a question </p>
                <input ref={question_ref} onKeyUp={answer_question} className="p-2  my-2 font-bold  rounded-lg" />
                <p className="text-white font-bold"> Answers </p>
                {loading ? <div> Loading... </div>: ""}
                {answer  ? answer.map((ans,index) => <div className="bg-blue-300 font-normal my-2 p-4 rounded-lg">
                  <p> {ans.text} ( {ans.score} ) </p>
                </div>) : ""}
              </div>

            </Fragment>
          }
        </div>
      </header>

    </div>
  );
}

export default App;
