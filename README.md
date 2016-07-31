# Buggy library-fileserver

A server implementation for a buggy library. This implementation uses a simple file storage and exposes the standard REST API.

# REST API

 - **GET /info**: Get information about this server implementation.
 - **GET /components**: The number of components defined in the storage.
 - **GET /components/list**: The meta ids of all defined components.
 - **GET /components/get/:meta**: Gets the component with the given meta id.
 - **POST /components/**: Set or update a component. The component must be a valid component, i.e. have a meta id and a port list.
 - **GET /meta/:component**: Get a list of all meta key for the given component without their values. If the component does not exists it sends a 400 error code.
 - **GET /meta/:component/:key**: Get the meta information for the given component and key.
 - **POST /meta/:component/:key**: Set or update the meta key for the given component. The POST value has to be in the format `{value: ...}`, e..g `{value: 2}` or `{value: {a: 'b'}}`.
 - **GET /config/:key**: Get the configuration for the given key.
 - **POST /config/:key**: Set the configuration for the given key. The POST value has to be in the format `{value: ...}`, e..g `{value: 2}` or `{value: {a: 'b'}}`.