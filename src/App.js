// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`
import { useEffect, useState } from "react";
import "./App.css";

const currnecies = `currencies`;
const listOfCountries = [
  { AUD: "Australian Dollar" },
  { BGN: "Bulgarian Lev" },
  { BRL: "Brazilian Real" },
  { CAD: "Canadian Dollar" },
  { CHF: "Swiss Franc" },
  { CNY: "Chinese Renminbi Yuan" },
  { CZK: "Czech Koruna" },
  { DKK: "Danish Krone" },
  { EUR: "Euro" },
  { GBP: "British Pound" },
  { HKD: "Hong Kong Dollar" },
  { HUF: "Hungarian Forint" },
  { IDR: "Indonesian Rupiah" },
  { ILS: "Israeli New Sheqel" },
  { INR: "Indian Rupee" },
  { ISK: "Icelandic Króna" },
  { JPY: "Japanese Yen" },
  { KRW: "South Korean Won" },
  { MXN: "Mexican Peso" },
  { MYR: "Malaysian Ringgit" },
  { NOK: "Norwegian Krone" },
  { NZD: "New Zealand Dollar" },
  { PHP: "Philippine Peso" },
  { PLN: "Polish Złoty" },
  { RON: "Romanian Leu" },
  { SEK: "Swedish Krona" },
  { SGD: "Singapore Dollar" },
  { THB: "Thai Baht" },
  { TRY: "Turkish Lira" },
  { USD: "United States Dollar" },
  { ZAR: "South African Rand" },
];

// allows access to the key names in a single array
const listOfCountriesKeys = listOfCountries
  .map((item) => Object.keys(item))
  .flat();

export default function App() {
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [output, setOutput] = useState(0);
  const [hasError, setHasError] = useState(false);

  const BASE_URL = `https://api.frankfurter.app/latest?amount=${query}&from=${from}&to=${to}`;
  const TEST = `https://api.frankfurter.app/${currnecies}`;

  // currency conversion api call
  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setHasError("");
        const res = await fetch(BASE_URL, { signal: controller.signal });
        if (!res.ok)
          throw new Error(
            "something went wrong with fetching currency calculations"
          );

        const data = await res.json();
        // console.log(data);
        console.log(Object.values(data.rates));
        if (to === from) setOutput(query);
        setOutput(Object.values(data.rates));
      } catch (err) {
        if (err.name !== "AbortError") setHasError(err.message);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [query, to, from]);

  return (
    <>
      {" "}
      <div className="main-container">
        <h1>Currency Converter</h1>
        <input
          placeholder="enter value"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="number"
        />

        <select value={from} onChange={(e) => setFrom(e.target.value)}>
          {listOfCountriesKeys.map((country) => {
            return (
              <option key={country + "from"} value={country}>
                {country}
              </option>
            );
          })}
        </select>

        <select value={to} onChange={(e) => setTo(e.target.value)}>
          {listOfCountriesKeys.map((country) => {
            // * if statement prevents converting to the same value, which causes a 404 error in the API
            if (country === from)
              return (
                <option disabled key={country + "to"} value={country}>
                  {country}
                </option>
              );
            else
              return (
                <option key={country + "to"} value={country}>
                  {country}
                </option>
              );
          })}
        </select>

        <button
          onClick={() => {
            setOutput(0);
            setTo("EUR");
            setFrom("USD");
            setQuery("");
          }}
        >
          reset
        </button>

        <p>{output}</p>
      </div>
      
      <div className="glossary">
        <ul>
          {listOfCountries.map((item) => {
            return (
              <li
                style={{ listStyle: "none", margin: "1rem 0" }}
                key={Object.keys(item)}
              >
                {Object.keys(item) + " = " + Object.values(item)}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
