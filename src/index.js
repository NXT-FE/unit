import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import {Button} from 'antd';

class ScrollToTop extends Component {
	componentDidUpdate(prevProps) {
		if (this.props.location !== prevProps.location) {
			window.scrollTo(0, 0);
		}
	}

	render() {
		return this.props.children;
	}
}

const AppWrapper = () => (
	<ScrollToTop>
		<Button type="praimary">test button</Button>
	</ScrollToTop>
)

ReactDOM.render(
	<Router>
		<Switch>
			<Route component={AppWrapper} />
		</Switch>
	</Router>,
	document.getElementById('efos-root')
);

if (process.env.NODE_ENV === 'development') {
	if (module.hot) {
		module.hot.accept();
	}
}
