/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

class MarkAsReadComponent extends Component {

  constructor (opts) {
    super(opts);
    this.state = {};
  }

  getInitialState () {
    return { selected: MessageStore.selected() };
  }

  componentDidMount () {
    this.unlisten = MessageStore.listen(() => this.setState({ selected: MessageStore.selected() }));
  }

  componentWillUnmount() {
    return this.unlisten();
  }

  render() {
    // Try throwing an exception in here for fun!
    // @doesNotExist()
    // throw new Error("AHHHH")

    let classname = 'btn';
    if (
      !(this.state.selected != null ? this.state.selected.unread : undefined)
    ) {
      classname += ' disabled';
    }

    return React.createElement(
      'div',
      { className: classname, onClick: this._onClick },
      `
        Mark as Read
      `,
    );
  }

  _onClick() {
    if (!this.state.selected) return;
    const msg = _.extend({}, this.state.selected);
    msg.unread = false;
    return Actions.persistData(msg);
  }
}

Actions.register(MarkAsReadComponent, { role: 'message-action' });
