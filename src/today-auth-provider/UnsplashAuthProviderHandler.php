<?php


namespace DynamicScreen\Today\TodayAuthProvider;

use Unsplash\HttpClient as UnsplashClient;
use Unsplash\Photo;
use DynamicScreen\SdkPhp\Handlers\OAuthProviderHandler;
use Illuminate\Support\Facades\Session;

class UnsplashAuthProviderHandler extends OAuthProviderHandler
{
    public function identifier()
    {
        return 'unsplash';
    }

    public function name()
    {
        return "Unsplash";
    }

    public function description()
    {
        return "Photos";
    }

    public function icon()
    {
        return "fas fa-images";
    }

    public function color(){
        return '#239d00';
    }

    public function isSafeToBePublic()
    {
        return true;
    }

    public function handleConnection($request)
    {
//        $ds_uuid = 'oauth.unsplash.' . (string) Str::uuid();
//        Session::put($ds_uuid,compact('space_name','account_id'));
        $url_callback = route('api.callback', ['driver_id' => $this->identifier(), 'ds_uuid' => $ds_uuid]);
        $callbackUrl = route('api.callback', [$app, $module]);


        $config = $request->get('config');
        $this->initConnection($callbackUrl);

        $scopes = ['public', 'read_user'];

        return UnsplashClient::$connection->getConnectionUrl($scopes);
    }

    public function signin($space_name, $account_id)
    {
        $ds_uuid = 'oauth.unsplash.' . (string) Str::uuid();
        Session::put($ds_uuid,compact('space_name','account_id'));
        $url_callback = route('oauth.callback', ['driver_id' => $this->identifier(), 'ds_uuid' => $ds_uuid]);

        $this->initConnection(compact('url_callback'));

        $scopes = ['public', 'read_user'];

        return UnsplashClient::$connection->getConnectionUrl($scopes);
    }

    public function callback($request, $redirectUrl)
    {
        $code = $request->input('code');
        $data = $request->all();

        $callbackUrl = $request->get('callback_url');

        $this->initConnection([$callbackUrl]);

        $token = UnsplashClient::$connection->generateToken($code);

        $data['processed_options'] = $this->processOptions($token->jsonSerialize());

        return $redirectUrl->with('data', compact($data));
    }

    public function getUserInfos($config)
    {
        $this->initConnection($config);
        $infos = UnsplashClient::$connection->getResourceOwner()->toArray();
        if(isset($infos['errors'])){
            throw new \Exception($infos['error'][0]);
        }
        return $infos;
    }

    public function testConnection($config)
    {
        return $this->getUserInfos($config);
    }

    public function initConnection($config)
    {
        if (isset($config['callback_url'])) {
            UnsplashClient::init([
                'applicationId' => config('unsplash.APP_ID'),
                'secret' => config('unsplash.SECRET_KEY'),
                'callbackUrl' => $config['callback_url'],
                'utmSource' => config('unsplash.APP_NAME')
            ]);
        }
        else if (isset($config['access_token'])) {
            UnsplashClient::init([
                'applicationId' => config('unsplash.APP_ID'),
                'secret' => config('unsplash.SECRET_KEY'),
                'utmSource' => config('unsplash.APP_NAME')
            ],[
                'access_token' => $config['access_token'],
                'expires_in' => 30000
            ]);
        }
    }

    public function getRandomPhoto($config, $category)
    {
        $this->initConnection($config);
        $randPhotos = Photo::random(['query' => $category, 'orientation' => 'landscape']);
        return ['photographer' => $randPhotos->user['name'], 'url' => $randPhotos->urls['raw']];
    }
}
