// useToken.js
import { useSelector } from 'react-redux';

const useToken = () => {
    const token = useSelector((state) => state.auth.token);
    return token;
};

export default useToken;
