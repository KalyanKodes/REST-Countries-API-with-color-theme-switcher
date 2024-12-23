import React, { useEffect, useReducer } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import "../Styles/search.css"







function CountryCard({ imgSource, countryName, countryPopulation, countryRegion, countryCapial, wholeCountryObj }) {
    return (
        <Link to={"/country"} className='country-card' state={{ wholeCountryObj }}>
            <div>
                <div className="country-flag-wrapper">
                    <img src={imgSource} alt="country-flag" />
                </div>
                <div className="country-details">
                    <h1>{countryName}</h1>
                    <p>Population: <span>{countryPopulation}</span></p>
                    <p>Region: <span>{countryRegion}</span></p>
                    <p>Capital: <span>{countryCapial}</span></p>
                </div>
            </div>
        </Link>
    )
}


const ACTION_TYPES = {
    SET_LOADING: "SET_LOADING",
    REMOVE_LOADING: 'REMOVE_LOADING',
    SET_REGION: 'SET_REGION',
    SET_DATA: 'SET_DATA',
    SET_ERROR: 'SET_ERROR',
    REMOVE_ERROR: 'REMOVE_ERROR',
    SET_ERROR_MESSAGE: 'SET_ERROR_MESSAGE',
    SET_RENDER_DATA: 'SET_RENDER_DATA',
    SET_INPUT_TEXT: 'SET_INPUT_TEXT',
}

const initialState = {
    loading: true,
    allData: null,
    toRender: null,
    errorMessage: "",
    region: 'asia',
    inputText: "",
    error: false
}



function reducer(state, action) {
    switch (action.type) {
        case ACTION_TYPES.SET_LOADING:
            return { ...state, loading: true }
        case ACTION_TYPES.REMOVE_LOADING:
            return { ...state, loading: false }
        case ACTION_TYPES.SET_DATA:
            return { ...state, allData: action.payload.data }
        case ACTION_TYPES.SET_RENDER_DATA:
            return { ...state, toRender: action.payload.data }
        case ACTION_TYPES.SET_ERROR_MESSAGE:
            return { ...state, errorMessage: action.payload.errorMessage }
        case ACTION_TYPES.SET_REGION:
            return { ...state, region: action.payload.region }
        case ACTION_TYPES.SET_INPUT_TEXT:
            return { ...state, inputText: action.payload.inputText }
        case ACTION_TYPES.SET_ERROR:
            return { ...state, error: true }
        case ACTION_TYPES.REMOVE_ERROR:
            return { ...state, error: false }
        default:
            return state;
    }
}

export default function Home() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const explicitDelay = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                fetch('./data.json')
                    .then(res => {
                        return res.json();
                    })
                    .then(data => {
                        resolve(data)
                    }).catch((e) => {
                        return reject(e)
                    })
            }, 2000)
        })
    }
    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: ACTION_TYPES.SET_LOADING })
            try {
                const resolvedData = await explicitDelay();
                dispatch({ type: ACTION_TYPES.SET_DATA, payload: { data: resolvedData } })
            } catch (error) {
                dispatch({ type: ACTION_TYPES.REMOVE_LOADING })
                dispatch({ type: ACTION_TYPES.SET_ERROR })
                dispatch({ type: ACTION_TYPES.SET_ERROR_MESSAGE, payload: { errorMessage: error } })
            }
        };

        fetchData();

    }, []);


    useEffect(() => {
        if (state.allData) {
            dispatch({ type: ACTION_TYPES.REMOVE_ERROR })
            dispatch({ type: ACTION_TYPES.SET_LOADING })
            let filteredRegions = state.allData.filter((country) => country.region.toUpperCase() === state.region.toUpperCase())
            dispatch({ type: ACTION_TYPES.REMOVE_LOADING })
            dispatch({ type: ACTION_TYPES.SET_RENDER_DATA, payload: { data: filteredRegions } })
        }
    }, [state.region, state.allData])


    useEffect(() => {
        // Start Here
        if (state.inputText && state.allData != null) {
            dispatch({ type: ACTION_TYPES.REMOVE_ERROR })

            let searchResults = state.allData.filter((country) => {
                return (country.name.toLowerCase().startsWith(state.inputText) ||
                    country.name.toLowerCase().endsWith(state.inputText) ||
                    country.name.toLowerCase().includes(state.inputText))
            });
            let result = new Set(searchResults);
            if (result.size !== 0) {
                dispatch({ type: ACTION_TYPES.SET_RENDER_DATA, payload: { data: new Array(...result) } })
            }
            else {
                dispatch({ type: ACTION_TYPES.SET_ERROR })
                dispatch({ type: ACTION_TYPES.SET_ERROR_MESSAGE, payload: { errorMessage: "No Details Found" } })
            }
        }
    }, [state.inputText])

    const gettoRender = (e) => {
        dispatch({ type: ACTION_TYPES.SET_REGION, payload: { region: e.target.value } })
    }

    let timer;
    const searchCountry = (e) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            dispatch({ type: ACTION_TYPES.SET_INPUT_TEXT, payload: { inputText: e.target.value } })
        }, 500)
    }

    return (
        <>
            <div className="search-wrapper">

                <div className="input-box-wrapper">
                    <label htmlFor="country-input-box">
                        <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                    </label>
                    <input type="text" id='country-input-box' placeholder='Search for a country' onChange={(e) => searchCountry(e)} />
                </div>

                <select name="region" id="country-region" value={state.region} onChange={(e) => gettoRender(e)}>
                    <option value="africa">Africa</option>
                    <option value="america">America</option>
                    <option value="asia">Asia</option>
                    <option value="europe">Europe</option>
                    <option value="oceania">Oceania</option>
                </select>
            </div>

            <div className="home-countries">
                {
                    state.loading ?
                        <div>Getting details...</div>
                        : !state.error
                            ? state.toRender.map((country) => <CountryCard
                                key={country.numericCode}
                                imgSource={country.flags.png}
                                countryName={country.name}
                                countryPopulation={country.population}
                                countryRegion={country.region}
                                countryCapial={country.capital}
                                wholeCountryObj={country} />) :
                            <div>{state.errorMessage}</div>
                }
            </div>
        </>
    )
}
