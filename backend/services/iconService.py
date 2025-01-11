class IconService:
    def __init__(self):
        self.base_url = "https://openweathermap.org/img/wn"

    def get_icon_url(self, icon_code: str, size: str = "2x") -> str:
        """
        Generate URL for weather icon

        Args:
            icon_code (str): Weather icon code (e.g., '10d')
            size (str): Icon size ('1x' or '2x')

        Returns:
            str: Complete icon URL
        """
        return f"{self.base_url}/{icon_code}@{size}.png"

    def download_weather_icon(self, icon_code: str, size: str = "2x") -> str:
        """
        Download and save the weather icon locally.

        Args:
            icon_code (str): Weather icon code (e.g., '10d').
            size (str): Icon size ('1x' or '2x').

        Returns:
            str: Path to the saved icon file.
        """
        import os
        import requests
        from pathlib import Path

        # Generate the URL for the icon
        icon_url = self.get_icon_url(icon_code, size)

        # Define the temporary folder path in current directory
        temp_folder = Path("temp/weather_icons")
        temp_folder.mkdir(parents=True, exist_ok=True)

        # Define the file path for the icon
        icon_path = temp_folder / f"{icon_code}@{size}.png"

        # Download and save the icon
        response = requests.get(icon_url, stream=True)
        if response.status_code == 200:
            with open(icon_path, "wb") as file:
                file.write(response.content)
            print(f"Icon saved at: {icon_path}")
        else:
            print(f"Failed to download icon: {response.status_code}")

        return str(icon_path)
