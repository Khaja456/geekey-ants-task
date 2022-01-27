import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

import { timeSlots } from '../Utils';

import './CalenderEVents.css';
import "bootstrap/dist/css/bootstrap.min.css";

export function CalenderEvents() {
    const [allTimeSlots, setTimeSlots] = useState(timeSlots);
    const [slotDetails, setSlotDetails] = useState({});
    const [isOpen, setIsOpen] = React.useState(false);
    const [modalTitle, setmodalTitle] = React.useState("Loading....");

    const showModal = () => {
        setIsOpen(true);
    };

    const hideModal = () => {
        setIsOpen(false);
    };

    const modalLoaded = () => {
        setmodalTitle("Create New Meeting");
    };

    const handleChange = (e) => {
        const { value, name: someName } = e.target;
        setSlotDetails(slotDetails => ({
            ...slotDetails,
            [someName]: value
        }));
    };

    const addEventToSlot = (e) => {

        const [eventTime, eventSlot] = e.target.value.split('-');

        e.preventDefault();

        setSlotDetails({ time: Number(eventTime), slot: eventSlot });
        showModal();
    };

    const editMeeting = (e, eventIndex) => {
        console.log("Click is working!!!", eventIndex, e.taget);
        e.stopPropagation();
    };

    const saveSlotDetails = () => {
        const { time: eventTime, slot: eventSlot, title, slotValue } = slotDetails;

        const timeSlots = [...allTimeSlots];
        const targetEventIndex = timeSlots.findIndex(({ time, slot }) => time === eventTime && slot === eventSlot);

        if (targetEventIndex === -1) return;

        const targetEvent = timeSlots[targetEventIndex];
        const { events } = targetEvent;

        const newEvent = {
            from: eventTime,
            fromSlot: eventSlot,
            toSlot: slotValue,
            title
        };

        if (!events) {
            const newEvents = [newEvent];
            targetEvent['events'] = newEvents;
        } else {
            events.push(newEvent);
        }

        setTimeSlots(timeSlots);
        hideModal();
    };

    return (
        <div>
            {allTimeSlots.map(({ time, slot, events }, slotIndex) => (
                <div key={`sample-id${slotIndex}${time}`}>
                    <div className="each-event-slot">
                        <p className="time-slot">
                            <span>{time}</span><span>{slot}</span>
                        </p>
                        <hr className="harizontal-line" />
                    </div>
                    <button className="button-each-slot" value={`${time}-${slot}`} onClick={(e) => { addEventToSlot(e) }}>
                        {
                            events && events.length &&
                            events.map(({ from, fromSlot, toSlot, title }, eventIndex) => (
                                <div className="col-sm-2 meeting-buttons" value={`${slotIndex}-${eventIndex}`} key={eventIndex} onClick={(e, eventIndex) => { editMeeting(e, eventIndex) }}>
                                    <div className="card">
                                        <div className="card-body card-body-custom">
                                            <h6 className="card-title">{title}</h6>
                                            <p className="card-text">{`${from} ${fromSlot} to ${toSlot}`}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </button>
                </div>
            ))}
            <div>
                <Modal show={isOpen} onHide={hideModal} onEntered={modalLoaded}>
                    <Modal.Header>
                        <Modal.Title>{modalTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">Title</label>
                                <input type="text" className="form-control" name="title" value={slotDetails.title || ''} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleSelect">Time</label>
                                <select className="form-control" id="exampleSelect" name="slotValue" value={slotDetails.slotValue || ''} onChange={handleChange}>
                                    <option>----</option>
                                    {
                                        timeSlots.map(({ time, slot }, index) => (
                                            <option key={`${time}-${index}`}>{`${time} ${slot}`}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-primary" onClick={saveSlotDetails}>Save</button>
                        <button className="btn btn-danger" onClick={hideModal}>Cancel</button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    )
}