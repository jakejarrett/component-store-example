/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const MarkAsReadComponent = React.createClass({
  displayName: 'MarkAsReadComponent',

  getInitialState() {
    return { selected: MessageStore.selected() };
  },

  componentDidMount() {
    return (this.unlisten = MessageStore.listen(() => {
      return this.setState({ selected: MessageStore.selected() });
    }));
  },

  componentWillUnmount() {
    return this.unlisten();
  },

  render() {
    // Try throwing an exception in here for fun!
    // @doesNotExist()

    let classname = 'btn';
    if (
      !(this.state.selected != null ? this.state.selected.unread : undefined)
    ) {
      classname += ' disabled';
    }

    return React.createElement(
      'div',
      { className: classname, onClick: this._onClick },
      `\
Mark as Read\
`,
    );
  },

  _onClick() {
    if (!this.state.selected) {
      return;
    }
    const msg = _.extend({}, this.state.selected);
    msg.unread = false;
    return Actions.persistData(msg);
  },
});

Actions.register(MarkAsReadComponent, { role: 'message-action' });
