import { useEffect, useState } from "react";

const Main = () => {
    const [data, setData] = useState({
        country: [],
        state: [],
        city: []
    })
    const [value, setValue] = useState({
        country: "",
        state: "",
        city: ""
    })

    const valueUpdate = (val, identifier) => {
        setValue(prevState => ({
            ...prevState,
            [identifier]: val,
        }))

        if (identifier === "country") {
            getState(val);
            setValue(prev =>({
                ...prev,
                state: "",
                city: ""
            }))
        } else if (identifier === "state") {
            getCity(val);
            setValue(prev =>({
                ...prev,
                city: ""
            }))
        }
    }

    const getCountry = async () => {
        try {
            const res = await fetch("https://crio-location-selector.onrender.com/countries");
            const countryData = await res.json();
            setData((prevData) => ({
                ...prevData,
                country: countryData,
                state: [],
                city: []
            }))
        }
        catch (e) {
            console.error(e)
        }
    }

    const getState = async (countryS) => {
        if (!countryS) return;
        try {
            const res = await fetch(`https://crio-location-selector.onrender.com/country=${countryS}/states`);
            const stateData = await res.json();
            setData((prevData) => ({
                ...prevData,
                state: stateData,
                city: []
            }))
        }
        catch (e) {
            console.error(e)
        }
    }

    const getCity = async (cityS) => {
        if (!value.country || !cityS) return;
        try {
            const country = value.country;
            const res = await fetch(`https://crio-location-selector.onrender.com/country=${country}/state=${cityS}/cities`);
            const cityData = await res.json();
            setData((prevData) => ({
                ...prevData,
                city: cityData
            }))
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getCountry();

    }, []);

    return (<>
        <h1>Select Location</h1>
        <select value={value.country} onChange={(e) => valueUpdate(e.target.value, "country")} >
            <option value="option1" selected>Select Country</option>
            {
                data.country.map((coun, i) => (
                    <option key={i}>{coun}</option>
                ))
            }
        </select>
        <select disabled={!value.country} value={value.state} onChange={(e) => valueUpdate(e.target.value, "state")}>
            <option value="option1" selected>Select State</option>
            {
                data.state.map((coun, i) => (
                    <option key={i}>{coun}</option>
                ))
            }
        </select>
        <select disabled={!value.state} value={value.city} onChange={(e) => valueUpdate(e.target.value, "city")}>
            <option value="option1" selected>Select City</option>
            {
                data.city.map((coun, i) => (
                    <option key={i}>{coun}</option>
                ))
            }
        </select>
        {value.city && <p>{`You selected ${value.country}, ${value.state}, ${value.city}`}</p>}
    </>
    )
}

export default Main;