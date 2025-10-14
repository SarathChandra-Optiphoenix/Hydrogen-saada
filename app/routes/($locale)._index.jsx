import { MainHome } from '~/components/HomeMain';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'SAADAA | सादा - Better Basics for Everyone | Home'}];
};

/**
 * @param {Route.LoaderArgs} args
 */


export default function Homepage() {
  /** @type {LoaderReturnData} */
  return (
    <div className="home">
      <MainHome/>
    </div>
  );
}


