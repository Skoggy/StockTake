import { React, useState, useEffect } from 'react';
import { useFetch } from './hooks/useFetch';
import { Hint } from 'react-autocomplete-hint';
import styled from 'styled-components'
import axios from 'axios';
import { Card } from './Card';

const Container = styled.div`
display:grid;
justify-content:center;
padding: 10px;
margin-top: 14rem;

input {
    height: 4rem;
    font-size: 3rem;
}

p {
    font-size: 20px;
}
`
const Button = styled.button`

	padding: 10px 40px;
    margin: 0px 10px 10px 0px;
	border-radius: 10px;
	font-size: 25px;
	color: #FFF;
	text-decoration: none;
	transition: all 0.1s;
    -webkit-transition: all 0.1s;
    background-color: var(--red);
	border-bottom: 5px solid var(--darkRed);
    text-shadow: 0px -2px var(--darkRed);
   :active{ 
    transform: translate(0px,5px);
    -webkit-transform: translate(0px,5px);
    border-bottom: 1px solid;
    outline:none;
   }
`
const FilloutStyles = styled.form`
display:grid;


`

const SearchBarStyles = styled.div`

`

export const TakeItem = () => {
    const stockURL = '/api/stocks'
    const noteUrl = '/api/stocknote'
    // search and the matching result
    const [search, setSearch] = useState({
        result: {},
        search: ''
    })
    const [note, setNote] = useState({
        note: '',
        sendNote: '',

    })
    const [takenMessage, setTakenMessage] = useState('')
    // stores all of the stock names to allow for autofill
    const [option, setOption] = useState([])
    // used to get update the amount that is taken from stock
    const [amounts, setAmounts] = useState({
        uuid: '',
        amount: ''
    })

    const [noMatch, setNoMatch] = useState('')
    // fetches data from url
    const { data } = useFetch(stockURL)


    // sets the option with the data to get the names.
    useEffect(() => {
        setOption(data)
    }, [data,])

    // takes stock from database
    const takeStock = (e) => {
        e.preventDefault();
        const data = search.result.uuid
        const put = { amount: search.result.amount - amounts.amount }
        axios.put(`${stockURL}/${data}`, put).then((result) => {
            setTakenMessage(`You have taken ${amounts.amount} ${search.result.name} from stock`)
        })
    }

    // creates note from database
    const addNote = (e) => {
        e.preventDefault();
        const data = search.result.uuid
        const notes = { note: note.sendNote }
        axios.put(`${noteUrl}/${data}`, notes).then((result) => {
            setNote({ ...note, note: note.sendNote, sendNote: '' })

        })
    }
    // takes what is put in the amount to be updated.
    const onAmountChange = (e) => {
        e.persist();
        setAmounts({ ...amounts, amount: e.target.value })
    }

    const onNoteChange = (e) => {
        setNote({ ...note, sendNote: e.target.value })

    }

    // pushes the names of all the stock into the options array to be used for autofill.
    let options = []
    option && option.forEach(thing => { options.push(thing.name) })

    // checks if there is a match.
    const checkMatch = (e) => {
        e.preventDefault()
        setTakenMessage('')
        setSearch({ ...search, result: {} })
        setNoMatch('No Match Found')
        data.forEach(thing => {

            if (thing.name === search.search) {
                setSearch({ ...search, result: thing })
                setNote({ ...note, note: thing.note })

            }
        })
    }
    return (
        <div>
            <Container>

                <FilloutStyles>
                    <SearchBarStyles>
                        <Hint options={options}>
                            <input type="text" placeholder="Search" onChange={(e) => setSearch({ ...search, search: e.target.value })} />
                        </Hint>
                        <Button onClick={checkMatch}>Check</Button>
                    </SearchBarStyles>
                    {Object.entries(search.result).length ?
                        <div>

                            <Card
                                title={search.result.name}
                                body=''
                                amount={search.result.amount - amounts.amount}
                            />
                            <input type="number"
                                name="TakeStock"
                                id="TakeStock"
                                value={amounts.amount}
                                onChange={onAmountChange} />
                            <Button onClick={takeStock}>Take</Button>
                            <p>{takenMessage}</p>
                            <div>
                                <input type="text"
                                    name='note'
                                    id='note'
                                    value={note.sendNote}
                                    onChange={onNoteChange} />
                                <Button onClick={addNote}>Add Note</Button>

                                <p>{note.note}</p>

                            </div>
                        </div >
                        :
                        <div>{noMatch}</div>}

                </FilloutStyles >

            </Container>
        </div>
    )
}
