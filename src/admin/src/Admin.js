import "./Admin.css";
import React from "react";
import ReadAnnouncement from "./ReadAnnouncement.js"
import DeleteAnnouncement from "./DeleteAnnouncement.js"

class Timestamp extends React.Component {
    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        this.props.onChange(event.target.name, event.target.value);
    }

    render() {
        return (
            <input
                required
                value={this.props.value}
                name={this.props.name}
                type="datetime-local"
                onChange={this.handleInputChange}
            ></input>
        );
    }
}

class Priority extends React.Component {
    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        this.props.onChange(event.target.value);
    }

    render() {
        return (
            <select value={this.props.value} className="priority" onChange={this.handleInputChange}>
                <option value="LOW">Baja</option>
                <option value="MID">Media</option>
                <option value="HIGH">Alta</option>
            </select>
        );
    }
}


class CreateAnnouncement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title != null ? this.props.title : "",
            body: this.props.body != null ? this.props.body : "",
            fromTimestamp: this.props.fromTimestamp != null ? this.setTimestamp(new Date(this.props.fromTimestamp * 1000)) : this.setTimestamp(new Date()),
            toTimestamp: this.props.toTimestamp != null ? this.setTimestamp(new Date(this.props.toTimestamp * 1000)) : this.setTimestamp(new Date()),
            priority: this.props.priority != null ? this.props.priority : "MID",
            author: this.props.author != null ? this.props.author : "",
            photo: "",
            photo64: "",
            id: this.props.id != null ? this.props.id : "",
        };

        this.handleTimestampChange = this.handleTimestampChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handlePriorityChange = this.handlePriorityChange.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    setTimestamp(timestamp) {
        let year = timestamp.getFullYear();
        let month = timestamp.getMonth() < 10 ? "0" + (timestamp.getMonth() + 1) : timestamp.getMonth() + 1;
        let day = timestamp.getDate() < 10 ? "0" + timestamp.getDate() : timestamp.getDate();
        let hours = timestamp.getHours() < 10 ? "0" + timestamp.getHours() : timestamp.getHours();
        let minutes = timestamp.getMinutes() < 10 ? "0" + timestamp.getMinutes() : timestamp.getMinutes();

        return year + "-" + month + "-" + day + "T" + hours + ":" + minutes;
    }

    handleTimestampChange(name, value) {
        if (name === "fromTimestamp") {
            this.setState({
                fromTimestamp: value
            });
        } else {
            this.setState({
                toTimestamp: value
            });
        }
    }

    handleTextChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handlePriorityChange(value) {
        this.setState({
            priority: value
        });
    }

    handleFileChange(event) {
        let file = event.target.files[0];

        this.setState({
            photo: file
        });

        // convert photo to base64
        let reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = (e) => {
            this.setState({
                photo64: e.target.result
            });
        };
    }

    handleSubmit(event) {
        event.preventDefault();

        // if the photo is not PNG, return
        if (
            this.state.photo != null &&
            this.state.photo !== "" &&
            this.state.photo.type !== "image/png" &&
            this.state.photo.type !== "image/jpg" &&
            this.state.photo.type !== "image/jpeg"
        ) {
            alert("Nada más se soportan imágenes de tipo PNG/JPG/JPEG.");
            return;
        }

        const insert = {
            id: this.state.id,
            title: this.state.title.trim(),
            message: this.state.body.trim(),
            writer: this.state.author.trim(),
            priority: this.state.priority.trim(),
            photo: this.state.photo64.trim(),
            timestamp_begin: parseInt(Date.parse(this.state.fromTimestamp) / 1000),
            timestamp_end: parseInt(Date.parse(this.state.toTimestamp) / 1000),
            timestamp_create: parseInt(Date.now() / 1000),
            timestamp_update: null
        };

        if (this.state.id !== "") {
            const options = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(insert)
            };

            // TODO: handle code 413 (payload too large)
            fetch("/backend/announcement/", options)
                .then((response) => response.text())
                .then((text) => console.log(text))
                .catch((cause) => console.log("couldn't submit announcement form: " + cause));

        }
        else {
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(insert)
            };

            // TODO: handle code 413 (payload too large)
            fetch("/backend/announcement/", options)
                .then((response) => response.text())
                .then((text) => console.log(text))
                .catch((cause) => console.log("couldn't submit announcement form: " + cause));
        }
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Título:</label>
                    <input
                        required
                        name="title"
                        type="text"
                        value={this.state.title}
                        onChange={this.handleTextChange}
                    />

                    <label>Anuncio:</label>
                    <textarea required name="body" value={this.state.body} onChange={this.handleTextChange}></textarea>

                    <label>Desde:</label>
                    <Timestamp
                        value={this.state.fromTimestamp}
                        name="fromTimestamp"
                        onChange={this.handleTimestampChange}
                    />

                    <label>Hasta:</label>
                    <Timestamp
                        value={this.state.toTimestamp}
                        name="toTimestamp"
                        onChange={this.handleTimestampChange}
                    />

                    <label className="PriorityLabel">Prioridad:
                        <Priority onChange={this.handlePriorityChange} value={this.state.priority} />
                    </label>

                    <label className="authorLabel">Autor/a:</label>
                    <input
                        required
                        className="authorInput"
                        name="author"
                        type="text"
                        value={this.state.author}
                        onChange={this.handleTextChange}
                    />

                    <label>
                        Foto:
                        <input type="file" onChange={this.handleFileChange} />
                    </label>

                    <button>Publicar</button>
                </form>
            </div>
        );
    }
}


class EditAnnouncement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gui: null
        };
        this.handleEditSelection = this.handleEditSelection.bind(this);
    }


    handleEditSelection(announcementID) {

        fetch("/backend/announcement/" + announcementID)
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                this.setState({
                    gui: <CreateAnnouncement title={json.title}
                        body={json.message}
                        priority={json.priority}
                        fromTimestamp={json.timestamp_begin}
                        toTimestamp={json.timestamp_end}
                        author={json.writer}
                        id={json.id} />
                })
            })
            .catch((cause) => console.log("couldn't get announcement info: " + cause));
    }

    render() {
        return (
            <div>
                {this.state.gui}
            </div>
        );
    }
}

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gui: null
        };

        this.handleCreateAnnouncement = this.handleCreateAnnouncement.bind(this);
        this.handleSeeAnnouncements = this.handleSeeAnnouncements.bind(this);
        this.handleDeleteAnnouncement = this.handleDeleteAnnouncement.bind(this);
        this.handleEditAnnouncement = this.handleEditAnnouncement.bind(this);
        this.handleEditSelection = this.handleEditSelection.bind(this);
    }


    handleEditSelection(announcementID) {

        fetch("/backend/announcement/" + announcementID)
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                this.setState({
                    gui: <CreateAnnouncement title={json.title}
                        body={json.message}
                        priority={json.priority}
                        fromTimestamp={json.timestamp_begin}
                        toTimestamp={json.timestamp_end}
                        author={json.writer}
                        id={json.id} />
                })
            })
            .catch((cause) => console.log("couldn't get announcement info: " + cause));
    }

    handleCreateAnnouncement() {
        this.setState({
            gui: <CreateAnnouncement />
        });
    }

    handleDeleteAnnouncement() {
        this.setState({
            gui: <DeleteAnnouncement />
        });
    }

    handleSeeAnnouncements() {
        this.setState({
            gui: <ReadAnnouncement action={null} />
        });
    }

    handleEditAnnouncement() {
        this.setState({
            gui:
                <ReadAnnouncement action={"Editar"} onRowSelection={this.handleEditSelection} />
        });
    }

    render() {
        return (
            <div className="Admin">
                <header className="Admin-header">
                    <div className="menuAnnouncement">
                        <button onClick={this.handleCreateAnnouncement}>Crear Anuncio</button>

                        <button onClick={this.handleSeeAnnouncements}>Ver Anuncios</button>

                        <button onClick={this.handleEditAnnouncement}>Editar Anuncio</button>

                        <button onClick={this.handleDeleteAnnouncement}>Eliminar Anuncio</button>

                    </div>
                    {this.state.gui}
                </header >
            </div >
        );
    }
}

export default Admin;
