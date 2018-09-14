import zh from './zh';
import en from './en';

export default ({
    zh,
    en
})[navigator.language.split('-')[0]];
