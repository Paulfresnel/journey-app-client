import ProgressBar from 'react-bootstrap/ProgressBar';

function UserProgress(props) {
  const { now } = props;
  return <ProgressBar now={now} label={`${now}%`} />;
}

export default UserProgress;