import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { url } from '../App';
import { toast } from 'react-toastify';

const AddSong = () => {
    const [image, setImage] = useState(null);
    const [song, setSong] = useState(null);
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [album, setAlbum] = useState("none");
    const [loading, setLoading] = useState(false);
    const [albumData, setAlbumData] = useState([]);

    useEffect(() => {
        // Fetch album data or perform any other side effects here
        // setAlbumData(fetchedAlbumData);
    }, []);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();

            formData.append('name', name);
            formData.append('desc', desc);
            formData.append('audio', song);
            formData.append('image', image);
            formData.append('album', album);


            const response = await axios.post(`${url}/api/song/add`, formData);

            if (response.data.success) {
                toast.success("Song added");
                setName("");
                setDesc("");
                setAlbum("none");
                setImage(false);
                setSong(false);
            }
            else {
                toast.error("Something went wrong");
            }

        } catch (error) {
            toast.error("Error Occured")
        }
        // Form submission logic here

        setLoading(false);
    }

    const loadAlbumData = async () => {
        try {
            const response = await axios.get(`${url}/api/album/list/`);
            if (response.data.success) {
                setAlbumData(response.data.albums);
            } else {
                toast.error("Unable to load almums data")
            }
        }

        catch (error) {
            toast.error("Error Occured")
        }
    }

    useEffect(() => {
        loadAlbumData();
    }, [])

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col items-start gap-8 text-gray-600'>
            <div className='flex gap-8'>
                <div className='flex flex-col gap-4'>
                    <p>Upload Song</p>
                    <input
                        onChange={(e) => setSong(e.target.files[0])}
                        type='file'
                        id='song'
                        accept='audio/*'
                        hidden
                    />
                    <label htmlFor='song'>
                        <img
                            src={song ? assets.upload_added : assets.upload_song}
                            className='w-24 cursor-pointer'
                            alt=''
                        />
                    </label>
                </div>
                <div className='flex flex-col gap-4'>
                    <p>Upload Image</p>
                    <input
                        onChange={(e) => setImage(e.target.files[0])}
                        type='file'
                        id='image'
                        accept='image/*'
                        hidden
                    />
                    <label htmlFor='image'>
                        <img
                            src={image ? URL.createObjectURL(image) : assets.upload_area}
                            className='w-24 cursor-pointer'
                            alt=''
                        />
                    </label>
                </div>
            </div>
            <div className='flex flex-col gap-2.5'>
                <p>Song name</p>
                <input
                    className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]'
                    placeholder='Type Here'
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className='flex flex-col gap-2.5'>
                <p>Song description</p>
                <input
                    className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]'
                    placeholder='Type Here'
                    type='text'
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    required
                />
            </div>
            <div className='flex flex-col gap-2.5'>
                <p>Album</p>
                <select
                    className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[150px]'
                    defaultValue={album}
                    onChange={(e) => setAlbum(e.target.value)}
                >
                    <option value='none'>None</option>
                    {/* Map through albumData to create more options */}
                    {albumData.map((item, index) => (
                        <option key={index} value={item.name}>{item.name}</option>
                    ))}
                </select>
            </div>
            <button
                type='submit'
                className='text-base bg-black text-white py-2.5 px-14 cursor-pointer'
                disabled={loading}
            >
                {loading ? 'Adding...' : 'ADD'}
            </button>
        </form>
    );
}

export default AddSong;
