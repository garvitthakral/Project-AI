import React, { useState } from "react";
import Breakdown from "./Breakdown";
import api from "../../API/axios";
import Loader from "../../components/Loader";
import { Filter } from "bad-words";

const BeforeBreakdown = () => {
  const [goal, setGoal] = useState("");
  const [responseCame, setResponseCame] = useState(false);
  const [ans, setAns] = useState({});
  const [badWordDetected, setBadWordDetected] = useState(false);
  const [backendError, setBackendError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const filter = new Filter();

    if (filter.isProfane(goal)) {
      setBadWordDetected(true);
      return;
    }

    try {
      const response = await api.post("/breakdown", { goal: goal });

      if (response.data.error) {
        setBackendError(true);
        setErrorMessage(response.data.reason);
        setLoading(false);
        return;
      }

      setAns(response.data.reason);
      setLoading(false);
      setResponseCame(true);
    } catch (error) {
      console.error("Error submitting goal:", error);
      setLoading(false);
    }
  };

  return (
    <div>
      {!responseCame ? (
        <div>
          <div>
            <h2>Breakdown your Goal in Steps</h2>
            <p>
              Enter your goal and break it down into smaller tasks & reach your
              goal.
            </p>
          </div>
          <div>{loading && <Loader />}</div>
          <div>
            {backendError && <p className="text-red-500">{errorMessage}</p>}
          </div>
          <div>
            {badWordDetected && (
              <p className="text-red-500">
                Please avoid using inappropriate words
              </p>
            )}

            <input
              type="text"
              placeholder="Enter your goal eg. Learn to build web apps"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
            <button onClick={handleSubmit}>Break it Down</button>
          </div>
        </div>
      ) : (
        <Breakdown response={ans} />
      )}
    </div>
  );
};

export default BeforeBreakdown;
