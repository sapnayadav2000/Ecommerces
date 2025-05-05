import axios from "axios";
import { useEffect, useState } from "react";

const useAsync = (asyncFunction) => {
  const [data, setData] = useState([] || {});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const run = async () => {
    try {
      setLoading(true);
      const res = await asyncFunction();
      setData(res);
      setError("");
    } catch (err) {
      if (axios.isCancel(err)) {
        setError(err.message);
        setData([]);
      } else {
        setError(err.message);
        setData([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let unmounted = false;
    let source = axios.CancelToken.source();

    run(); // Trigger the initial async function

    return () => {
      unmounted = true;
      source.cancel("Cancelled in cleanup");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asyncFunction]);

  return {
    data,
    error,
    loading,
    run, // Include the run function in the returned object
  };
};

export default useAsync;
