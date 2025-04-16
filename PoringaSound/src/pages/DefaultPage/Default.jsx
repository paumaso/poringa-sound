import Navbar from "../../components/Navbar/Navbar";
import LanguageSwitcher from "../../components/Navbar/LanguageSwitcher";
import AudioPlayer from "../../components/AudioPlayer/AudioPlayer";
import React, { Component } from "react";
import { useTranslation } from "react-i18next";


const DefaultPage = () => {
  const { t } = useTranslation();
  const audioSrc = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'; // Enlace público de audio MP3
  const songImage = 'https://www.soundhelix.com/wp-content/uploads/2020/11/SoundHelix-logo.jpg'; // Imagen de ejemplo
  const songTitle = 'SoundHelix Song 1';
  const songArtist = 'SoundHelix';
  return (
    <div>
      <Navbar />
      <div>
        <AudioPlayer
          audioSrc={audioSrc}
          songImage={songImage}
          songTitle={songTitle}
          songArtist={songArtist}
        />
      </div>
    </div>
  );
}

export default DefaultPage;