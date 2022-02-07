import { useContext, useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import isObject from "lodash/isObject";

import { addTicker, fetchTickers } from "../../services/tickerService";
import { getMetaThemeColor } from "../../theme";
import themeContext from "../../themeContext";
import styles from "./AddTickerModal.module.scss";

function AddTickerModal({ onClose, refreshTickers }) {
  const { mode } = useContext(themeContext);
  const [tickerList, setTickerList] = useState([]);
  const [tickerInputValue, setTickerInputValue] = useState("");
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    fetchTickers()
      .then((tickers) => {
        setTickerList(tickers);
      })
      .catch((err) => {
        setTickerList([
          {
            symbol: "",
            companyName: "",
            sector: "",
          },
        ]);
        console.error(err);
      });
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    if (!tickerInputValue) {
      setError("A ticker symbol must be provided.");
      setShowError(true);
    } else {
      if (addTicker(tickerInputValue)) {
        refreshTickers();
        onClose();
      } else {
        setError(`Unable to add ticker symbol ${tickerInputValue}.`);
        setShowError(true);
      }
    }
  }

  return (
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby="Add Ticker"
      aria-describedby="Add a ticker"
    >
      <form
        className={styles.layout}
        style={{ backgroundColor: getMetaThemeColor(mode) }}
        onSubmit={handleSubmit}
      >
        <FormControl className={styles.controlLayout} fullWidth>
          <span className={styles.closeButton}>
            <CloseIcon alt="Close" onClick={onClose} fontSize="medium" />
          </span>
          <div className={styles.subredditInput}>
            <Autocomplete
              freeSolo
              disablePortal
              fullWidth
              id="ticker-symbol"
              options={tickerList}
              getOptionLabel={(option) => {
                if (isObject(option)) {
                  return `${option.symbol} | ${option.companyName}`;
                }

                return option;
              }}
              inputValue={tickerInputValue}
              onInputChange={(event, newInputValue) => {
                setError("");
                setShowError(false);
                if (!newInputValue) {
                  setTickerInputValue("");
                  return;
                }
                const symbol = newInputValue.split("|")[0].trim();
                setTickerInputValue(symbol);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={showError}
                  helperText={error}
                  label="Enter a ticker symbol"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </div>
          <div className={styles.addButton}>
            <Button type="submit" variant="contained" fullWidth>
              Add
            </Button>
          </div>
        </FormControl>
      </form>
    </Modal>
  );
}

export default AddTickerModal;
