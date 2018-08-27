/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const ToggleRegionsButton = React.createClass({
  getInitialState() {
    return { active: ComponentStore.showComponentRegions() };
  },

  componentDidMount() {
    return (this.unlisten = ComponentStore.listen(() => {
      return this.setState({ active: ComponentStore.showComponentRegions() });
    }));
  },

  componentWillUnmount() {
    return this.unlisten();
  },

  render() {
    if (this.state.active) {
      return React.createElement(
        'div',
        { className: 'btn', onClick: this._toggleShowRegions },
        'Hide Injected Regions',
      );
    } else {
      return React.createElement(
        'div',
        { className: 'btn', onClick: this._toggleShowRegions },
        'Show Injected Regions',
      );
    }
  },

  _toggleShowRegions() {
    return Actions.toggleShowRegions();
  },
});

const LoadPluginButton = React.createClass({
  render() {
    return React.createElement(
      'div',
      { className: 'btn', onClick: this._onClick },
      "Load 'Mark As Read' Plugin",
    );
  },

  _onClick() {
    const script = document.createElement('script');
    script.setAttribute('type', 'text/cjsx');
    script.setAttribute(
      'src',
      'http://localhost:9001/src/plugins/test-plugin.cjsx',
    );
    document.head.appendChild(script);

    // Fire DOMContentLoaded to make the in-browser CJSX compilation
    // happen for our new script tag
    const loadedEvent = document.createEvent('Event');
    loadedEvent.initEvent('DOMContentLoaded', true, true);
    return window.document.dispatchEvent(loadedEvent);
  },
});

const Message = React.createClass({
  propTypes: {
    item: React.PropTypes.object.isRequired,
    selected: React.PropTypes.bool.isRequired,
  },

  render() {
    let classes = 'message';
    if (this.props.selected) {
      classes += ' selected';
    }
    if (this.props.item.unread) {
      classes += ' unread';
    }

    return React.createElement(
      'div',
      { className: classes, onClick: this._onSelect },
      React.createElement('div', { className: 'from' }, this.props.item.from),
      React.createElement(
        'div',
        { className: 'subject' },
        this.props.item.subject,
      ),
    );
  },

  _onSelect() {
    return Actions.selectMessage(this.props.item);
  },
});

const MessageList = React.createClass({
  getInitialState() {
    return {
      messages: MessageStore.items(),
      selected: MessageStore.selected(),
    };
  },

  componentDidMount() {
    return (this.unlisten = MessageStore.listen(() => {
      return this.setState({
        messages: MessageStore.items(),
        selected: MessageStore.selected(),
      });
    }));
  },

  componentWillUnmount() {
    return this.unlisten();
  },

  render() {
    return React.createElement(
      'div',
      { className: 'messages' },
      this.state.messages.map(msg => {
        return React.createElement(Message, {
          key: msg.id,
          item: msg,
          selected: msg === this.state.selected,
        });
      }),
    );
  },
});

window.RouteWelcome = React.createClass({
  contextTypes: {
    router: React.PropTypes.func,
  },

  render() {
    return React.createElement(
      'div',
      { style: { textAlign: 'center' } },
      React.createElement('h2', null, 'Messages'),

      React.createElement(InjectedComponentSet, {
        className: 'actions',
        matching: { role: 'message-action' },
      }),

      React.createElement(MessageList, null),

      React.createElement('hr', null),

      React.createElement(
        'div',
        { className: 'debug' },
        React.createElement(ToggleRegionsButton, null),
        React.createElement(LoadPluginButton, null),
      ),
    );
  },
});
