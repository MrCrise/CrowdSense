import asyncio
import logging
import sys

from aiogram import Bot, Dispatcher, html
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart, Command
from aiogram.types import Message, ReplyKeyboardMarkup, KeyboardButton, WebAppInfo

# Bot token can be obtained via https://t.me/BotFather
TOKEN = "8151127954:AAFPMLTgJ20VK-ulxXb3MBzz9H1WyoGxiDA"

# Initialize Dispatcher (Router) for handling incoming updates
dp = Dispatcher()

# For Windows, set event loop policy to avoid issues with asyncio on some platforms
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())


# Handler for the "/start" command
@dp.message(CommandStart())
async def command_start_handler(message: Message) -> None:
    # Create a custom keyboard with a button that opens a web app
    markup = ReplyKeyboardMarkup(
        keyboard=[
            [
                KeyboardButton(
                    text="Открыть",  # Button label
                    web_app=WebAppInfo(
                        url=f"https://mrcrise.github.io/")  # Web app URL
                )
            ]
        ],
        resize_keyboard=True  # Resize the keyboard for a cleaner appearance
    )

    # Send a message with the button
    await message.answer("Нажми на кнопку, чтобы открыть приложение", reply_markup=markup)


# Main function to run the bot
async def main() -> None:
    # Initialize Bot instance with default properties (HTML parse mode)
    bot = Bot(token=TOKEN, default=DefaultBotProperties(
        parse_mode=ParseMode.HTML))

    # Start polling for updates and dispatch events
    await dp.start_polling(bot)


# Entry point of the script
if __name__ == "__main__":
    # Set up logging to track bot activity
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)

    # Run the bot asynchronously
    asyncio.run(main())
