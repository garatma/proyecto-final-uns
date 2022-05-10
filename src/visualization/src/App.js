import "./App.css";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            event_table: null,
            events_per_hour: null
        };
    }

    recordsPerHour(hour, json) {
        let recordPerHour = [];
        json.forEach((element) => {
            var date = new Date(element.timestamp_event_begin * 1000);
            if (date.getHours() === hour) {
                recordPerHour.push(element);
            }
        });
        return recordPerHour;
    }

    getEventCountWithSameHour(json) {
        if (json == null) return null;
        let eventsPerHour = [];
        for (let i = 0; i < 23; i++) {
            eventsPerHour.push({ hour: i, records: null });
        }

        eventsPerHour.forEach((element) => {
            element.records = this.recordsPerHour(element.hour, json);
        });

        return eventsPerHour;
    }

    componentDidMount() {
        fetch("/backend/room-event")
            .then((response) => response.json())
            .then((json) => {
                this.setState({
                    event_table: json,
                    events_per_hour: this.getEventCountWithSameHour(json)
                });
            })
            .catch((razon) => alert("no se pudo hacer el request: " + razon));
    }

    render() {
        let eventList =
            this.state.events_per_hour == null
                ? null
                : this.state.events_per_hour.map((event, index) => {
                      const records = Object.values(event.records);
                      const eventRows = records.map((row, i) => {
                          const eventHour = i === 0 ? <td rowSpan={records.length + 1}>{event.hour}</td> : null;
                          return (
                              <tr key={i}>
                                  {eventHour}
                                  <td> {row.event_name} </td>
                                  <td> {row.room_name} </td>
                                  <td> {row.timestamp_event_end} </td>
                              </tr>
                          );
                      });
                      return (
                          <tbody key={index} className={event.hour}>
                              {eventRows}
                          </tbody>
                      );
                  });

        return (
            <div className="App">
                <header className="App-header">
                    <table className="table table-dark">
                        <thead className="thead-primary">
                            <tr>
                                <th colSpan="4">Hora actual</th>
                            </tr>
                            <tr>
                                <th>hora</th>
                                <th>evento</th>
                                <th>espacio</th>
                                <th>detalles</th>
                            </tr>
                        </thead>
                        {eventList}
                    </table>
                </header>
            </div>
        );
    }
}

export default App;
