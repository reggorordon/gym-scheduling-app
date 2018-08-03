class TimersDashboard extends React.Component {
  state = {
    timers: [],
};

componentDidMount(){
  this.loadtimersFromServer();
  setInterval(this.loadtimersFromServer, 5000);
}

loadtimersFromServer= () =>{
  client.getTimers((serverTimers)=>(
    this.setState({timers: serverTimers})
)
);
};

  handleCreateFormSubmit = (timer) => {
      this.createTimer(timer);
  };

  createTimer = (timer) => {
    const t = helpers.newTimer(timer);
    this.setState({
      timers: this.state.timers.concat(t),
    });

client.createTimer(t);
};


  handleEditFormSubmit = (attrs) => {
     this.updateTimer(attrs);
  };

  updateTimer = (attrs) => {
   this.setState({
     timers: this.state.timers.map((timer) => {
       if (timer.id === attrs.id) {
         return Object.assign({}, timer, {
           title: attrs.title,
           project: attrs.project,
           notes: attrs.notes,
});
} else {
         return timer;
       }
}), });
client.updateTimer(attrs);
};

handleTrashClick = (timerId) => {
    this.deleteTimer(timerId);
};

deleteTimer = (timerId) => {
  this.setState({
    timers: this.state.timers.filter(t => t.id !== timerId),
  });
  client.deleteTimer({id:timerId});
};

handleStartClick = (timerId) => {
   this.startTimer(timerId);
};
 handleStopClick = (timerId) => {
   this.stopTimer(timerId);
};

startTimer =(timerId) => {
  const now =Date.now();
this.setState({
  timers: this.state.timers.map((timer)=> {
    if(timer.id === timerId){
      return Object.assign({}, timer, {
        runningSince: now
      })
    }
    else{
      return timer
    }
  })
});
client.startTimer({id:timerId, start: now}
);
}


stopTimer = (timerId) =>{
  const now =Date.now();
this.setState({
  timers: this.state.timers.map((timer)=> {
    if (timer.id === timerId){
      const lastElapsed = now - timer.runningSince;
      return Object.assign({}, timer,
        {elapsed: timer.elapsed + lastElapsed, runningSince:null,
      });
    }
    else{
      return timer;
    }
  })
});
client.stopTimer({id: timerId, stop:now});
}
render() {
return (
<div className='ui three column centered grid'>

        <div className='column'>
          <EditableTimerList
          timers={this.state.timers}
          onFormSubmit={this.handleEditFormSubmit}
          onTrashClick={this.handleTrashClick}
          onStartClick={this.handleStartClick}
          onStopClick={this.handleStopClick}
          />

          <ToggleableTimerForm
          onFormSubmit={this.handleCreateFormSubmit}
          />

 </div>
      </div>
); }
}



//this has state as it is editable IE it needs to be opened or closed

class EditableTimer extends React.Component{

  state={
    editFormOpen: false,
  }

  handleEditClick = () => {
  this.openForm();
};
handleFormClose = () => {
  this.closeForm();
};

handleSubmit = (timer) => {
  this.props.onFormSubmit(timer);
  this.closeForm();
};

closeForm = () => {
  this.setState({ editFormOpen: false });
};
openForm = () => {
  this.setState({ editFormOpen: true });
};

  render(){
    if (this.state.editFormOpen){
      return(
              <TimerForm
                id={this.props.id}
                title={this.props.title}
                project ={this.props.project}
                notes ={this.props.notes}
                onFormSubmit={this.handleSubmit}
                onFormClose={this.handleFormClose}

                />
           );
           }
             else{
               return(
                 <Timer
                 id={this.props.id}
                 title={this.props.title}
                 project={this.props.project}
                 notes ={this.props.notes}
                 elapsed ={this.props.elapsed}
                 runningSince={this.props.runningSince}
                 onEditClick={this.handleEditClick}
                 onTrashClick={this.props.onTrashClick}
                 onStartClick={this.props.onStartClick}
                 onStopClick={this.props.onStopClick}

                 />
               );
             }
       }
     }


//this is all state

class TimerForm extends React.Component{
  //initial state of form
state={
  title: this.props.title || 'Squats/Curls  etc',
  project: this.props.project || 'Area Worked: legs/back etc',
  notes:this.props.notes || 'How you Felt It all went',
}

handleTitleChange=(e) =>{
  this.setState({title:e.target.value})

}

handleProjectChange=(e) =>{
  this.setState({project:e.target.value})

}

handleNotesChange=(e) =>{
  this.setState({notes:e.target.value})
}

//when submit button is clicked info is propagated to the form
handleSubmit = () => {
  this.props.onFormSubmit({
    id: this.props.id,
    title: this.state.title,
    project: this.state.project,
    notes: this.state.notes,
}); };

  render() {
const submitText = this.props.id ? 'Update' : 'Create'; return (
    <div className='ui centered card'>
        <div className='content'>
          <div className='ui form'>
              <div className='field'>
                <label>WorkOut</label>
                  <input  type='text'
                          value={this.state.title}
                          onChange={this.handleTitleChange}
                   /> </div>
                    <div className='field'>
                    <label>Area</label>
                  <input  type='text'
                          value={this.state.project}
                          onChange={this.handleProjectChange} />
                </div>
                <div className='field'>
                <label>Notes</label>
                <input type='text'
                        value={this.state.notes}
                        onChange={this.handleNotesChange}
                      />
                </div>

                <div className='ui two bottom attached buttons'>

                      <button className='ui basic blue button'
                               onClick={this.handleSubmit}>
                               Create
                      </button>
                      <button className='ui basic red button'
                              onClick={this.props.onFormClose}>
                              Cancel
                      </button>
                  </div>
          </div>
        </div>
      </div>
          );
  }
}

class ToggleableTimerForm extends React.Component{
  state={
    isOpen:false,
  }
//fat arrow function binds this to the component and not the global variable
  handleFormOpen=() => {
    this.setState({isOpen: true});
  }
  handleFormClose =()=> {
    this.setState({isOpen: false})
  }

  handleFormSubmit = (timer) => {
  this.props.onFormSubmit(timer);
  this.setState({ isOpen: false });
};

  render(){
    if (this.state.isOpen){
      return(
        <TimerForm
          onFormSubmit={this.handleFormSubmit}
          onFormClose={this.handleFormClose}
         />
      )
    }
    else{
      return(
        <div className='ui basic contentcenter aligned'>
        <button className='ui basic button icon' onClick={this.handleFormOpen}>
        <i className ='plus icon' />
        </button>
        </div>
      )
    }
  }
}


class Timer extends React.Component {
  componentDidMount() {
  this.forceUpdateInterval = setInterval(() => this.forceUpdate(), 50);
}
componentWillUnmount() {
  clearInterval(this.forceUpdateInterval);
}

handleStartClick=() =>{
  this.props.onStartClick(this.props.id)
}

handleStopClick =()=> {
  this.props.onStopClick(this.props.id)
}

  handleTrashClick=()=> {
    this.props.onTrashClick(this.props.id)
  }
   render() {
     const elapsedString = helpers.renderElapsedString(
           this.props.elapsed, this.props.runningSince
     );
return (
        <div className='ui centered card'>
          <div className='content'>
          <div className='header'> {this.props.title}
        </div>
        <div className='meta'> {this.props.project}
        </div>
        <div className='meta'> {this.props.notes}
        </div>
          <div className='center aligned description'>
            <h2>{elapsedString}</h2>
            </div>
          <div className='extra content'>
            <span className='right floated edit icon'>
              <i  className='edit icon'
                  onClick = {this.props.onEditClick}
               />
            </span>
            <span className='right floated trash icon'>
              <i  className='trash icon'
                  onClick={this.handleTrashClick}
                  />
            </span>
          </div>
        </div>

        <TimerActionButton
          timerIsRunning={!!this.props.runningSince}
          onStartClick={this.handleStartClick}
          onStopClick={this.handleStopClick}
          />

      </div>
); }
}

//this has no state, it only inherits from the timer dashboard

class EditableTimerList extends React.Component {
  render() {
    const timers = this.props.timers.map((timer) => (
      <EditableTimer
        key ={timer.id}
        id={timer.id}
        title={timer.title}
        project={timer.project}
        notes={timer.notes}
        elapsed={timer.elapsed}
        runningSince={timer.runningSince}
        onFormSubmit={this.props.onFormSubmit}
        onTrashClick={this.props.onTrashClick}
        onStartClick={this.props.onStartClick}
        onStopClick={this.props.onStopClick}


      />
    ));
    return(
      <div id='timers'>
        {timers}
        </div>
      );
  }
}

class TimerActionButton extends React.Component { render() {
if (this.props.timerIsRunning) { return (
<div
className='ui bottom attached red basic button' onClick={this.props.onStopClick}
>
Stop
</div> );
} else { return (
<div
className='ui bottom attached green basic button' onClick={this.props.onStartClick}
>
Start
</div> );
} }
}


ReactDOM.render(
  <TimersDashboard />,
  document.getElementById('content')
);
